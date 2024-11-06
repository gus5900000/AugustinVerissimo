class ProjectGallery {
  constructor(containerId = 'projects-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = containerId;
      document.body.appendChild(this.container);
    }
    this.currentView = 'gallery';
    this.projects = [];

    window.addEventListener('popstate', (e) => this.handleNavigation(e));
  }

  async loadProjects(projectFiles) {
    this.projects = [];
    for (const file of projectFiles) {
      try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const content = await response.text();
        const project = this.parseMarkdownProject(content, file);
        this.projects.push(project);
      } catch (error) {
        console.error(`Erreur lors du chargement de ${file}:`, error);
      }
    }
    this.renderGallery();
  }


  parseMarkdownProject(content, filePath) {
    const metadataRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(metadataRegex);
    
    if (!match) {
      return { 
        title: filePath.split('/').pop().replace('.md', ''),
        content,
        filePath,
        slug: this.createSlug(filePath.split('/').pop().replace('.md', ''))
      };
    }

    const metadataStr = match[1];
    const contentStr = match[2];
    
    const metadata = {};
    const lines = metadataStr.split('\n');
    let currentKey = null;
    let currentArray = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      if (line.startsWith('-') && lines[i].startsWith('  ')) {
        const value = line.substring(1).trim();
        if (currentKey && value) {
          if (!Array.isArray(metadata[currentKey])) {
            metadata[currentKey] = [];
          }
          metadata[currentKey].push(value);
        }
        continue;
      }

      const colonIndex = line.indexOf(':');
      if (colonIndex !== -1) {
        currentKey = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim();
        
        if (!value && i + 1 < lines.length && lines[i + 1].trim().startsWith('-')) {
          metadata[currentKey] = [];
        } else if (value) {
          metadata[currentKey] = value;
        }
      }
    }

    if (metadata.publishDate) {
      metadata.publishDate = metadata.publishDate.replace(/["']/g, '');
    }

    return {
      ...metadata,
      content: contentStr,
      filePath,
      slug: this.createSlug(metadata.title || filePath.split('/').pop().replace('.md', ''))
    };
  }


  createProjectCard(project) {
    const article = document.createElement('article');
    article.className = 'project-card';
    
    // Vérifie si nous sommes sur la page index
    const isIndexPage = window.location.pathname.includes('index.html');
    
    // Ajoute l'événement click seulement si nous ne sommes PAS sur la page index
    if (!isIndexPage) {
      article.addEventListener('click', () => this.showProjectDetail(project.slug));
    }
    
    const projectImage = document.createElement('div');
    projectImage.className = 'project-image';
    const img = document.createElement('img');
    img.src = project.img || '/placeholder-image.jpg';
    img.alt = project.img_alt || project.title;
    projectImage.appendChild(img);
    article.appendChild(projectImage);

    const projectContent = document.createElement('div');
    projectContent.className = 'project-content';

    const title = document.createElement('h3');
    title.textContent = project.title;
    projectContent.appendChild(title);

    if (project.description) {
      const description = document.createElement('p');
      description.textContent = project.description;
      projectContent.appendChild(description);
    }

    if (project.tags && Array.isArray(project.tags) && project.tags.length > 0) {
      const projectTags = document.createElement('div');
      projectTags.className = 'project-tags';
      project.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tag';
        tagSpan.textContent = tag;
        projectTags.appendChild(tagSpan);
      });
      projectContent.appendChild(projectTags);
    }

    if (project.publishDate) {
      const publishDate = document.createElement('time');
      publishDate.dateTime = project.publishDate;
      publishDate.textContent = new Date(project.publishDate).toLocaleDateString();
      projectContent.appendChild(publishDate);
    }

    article.appendChild(projectContent);
    return article;
  }


  async showProjectDetail(slug) {
    const project = this.projects.find(p => p.slug === slug);
    if (!project) return;

    history.pushState({ slug }, '', `/project/${slug}`);
    
    if (!window.marked) {
      await this.loadMarked();
    }

    this.container.innerHTML = '';
    
    const projectHead = document.createElement('div');
    projectHead.className = 'project-head';

    const projetLeft = document.createElement('div');
    projetLeft.className = 'projet-left';
    const backLink = document.createElement('a');
    backLink.href = '#';
    backLink.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Retour aux projets
    `;
    backLink.addEventListener('click', (e) => {
      e.preventDefault();
      this.showGallery();
    });
    projetLeft.appendChild(backLink);

    const projetRight = document.createElement('div');
    projetRight.className = 'projet-right';
    const title = document.createElement('h1');
    title.textContent = project.title;
    projetRight.appendChild(title);

    if (project.description) {
      const description = document.createElement('p');
      description.textContent = project.description;
      projetRight.appendChild(description);
    }

    if (project.tags && Array.isArray(project.tags)) {
      const projectTags = document.createElement('div');
      projectTags.className = 'project-tags';
      project.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tag';
        tagSpan.textContent = tag;
        projectTags.appendChild(tagSpan);
      });
      projetRight.appendChild(projectTags);
    }

    projectHead.appendChild(projetLeft);
    projectHead.appendChild(projetRight);
    this.container.appendChild(projectHead);

    const content = document.createElement('div');
    content.className = 'project-content';
    content.innerHTML = marked.parse(project.content);
    this.container.appendChild(content);

    this.currentView = 'detail';
  }

  showGallery() {
    history.pushState(null, '', '/project');
    this.renderGallery();
    this.currentView = 'gallery';
  }

  renderGallery() {
    this.container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'projects-grid';
    
    const isIndexPage = window.location.pathname.includes('index.html');
    
    const projectsToDisplay = isIndexPage ? this.projects.slice(0, 3) : this.projects;
    
    projectsToDisplay.forEach(project => {
      grid.appendChild(this.createProjectCard(project));
    });
    
    this.container.appendChild(grid);
  }

  handleNavigation(event) {
    if (event.state && event.state.slug) {
      this.showProjectDetail(event.state.slug);
    } else {
      this.showGallery();
    }
  }

  async loadMarked() {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/marked/9.1.0/marked.min.js';
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
}



document.addEventListener('DOMContentLoaded', () => {
  const gallery = new ProjectGallery();
  const projectFiles = [
    '/project/AFP.md',
    '/project/AFPExtented.md',
    '/project/space-invader.md',
    '/project/snake_IA.md'
  ];
  gallery.loadProjects(projectFiles);
});