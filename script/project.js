class Project {
  constructor({ title, content, filePath, slug, img, img_alt, description, tags, publishDate, category }) {
    this.title = title;
    this.content = content;
    this.filePath = filePath;
    this.slug = slug;
    this.img = img;
    this.img_alt = img_alt;
    this.description = description;
    this.tags = tags;
    this.publishDate = publishDate;
    this.category = category;
  }

  createElement() {
    const article = document.createElement('article');
    article.className = 'project-card';

    const projectImage = document.createElement('div');
    projectImage.className = 'project-image';
    const img = document.createElement('img');
    img.src = this.img || '/placeholder-image.jpg';
    img.alt = this.img_alt || this.title;
    projectImage.appendChild(img);
    article.appendChild(projectImage);

    const projectContent = document.createElement('div');
    projectContent.className = 'project-content';

    const title = document.createElement('h3');
    title.textContent = this.title;
    projectContent.appendChild(title);

    if (this.description) {
      const description = document.createElement('p');
      description.textContent = this.description;
      projectContent.appendChild(description);
    }

    if (this.tags && Array.isArray(this.tags) && this.tags.length > 0) {
      const projectTags = document.createElement('div');
      projectTags.className = 'project-tags';
      this.tags.forEach(tag => {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'tag';
        tagSpan.textContent = tag;
        projectTags.appendChild(tagSpan);
      });
      projectContent.appendChild(projectTags);
    }

    if (this.publishDate) {
      const publishDate = document.createElement('time');
      publishDate.dateTime = this.publishDate;
      publishDate.textContent = new Date(this.publishDate).toLocaleDateString();
      projectContent.appendChild(publishDate);
    }

    article.appendChild(projectContent);
    return article;
  }
}

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
    this.currentCategory = 'all';

    window.addEventListener('popstate', (e) => this.handleNavigation(e));

    // Ajouter un gestionnaire d'événements pour les boutons de filtrage
    document.querySelectorAll('.filter-button').forEach(button => {
      button.addEventListener('click', () => this.filterProjects(button.dataset.category));
    });
  }

  async loadProjects(projectFiles) {
    const loader = new MarkdownLoader();
    this.projects = await loader.loadProjects(projectFiles);
    this.renderGallery();
  }

  filterProjects(category) {
    this.currentCategory = category;
    this.renderGallery();
    // Mettre à jour l'apparence des boutons
    document.querySelectorAll('.filter-button').forEach(button => {
      button.classList.toggle('active', button.dataset.category === category);
    });
  }

  renderGallery() {
    this.container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'projects-grid';

    const isRootPage = window.location.pathname === '/';
    const projectsToDisplay = this.projects.filter(project =>
      this.currentCategory === 'all' || project.category === this.currentCategory
    );

    const limitedProjects = isRootPage ? projectsToDisplay.slice(0, 3) : projectsToDisplay;

    limitedProjects.forEach(project => {
      const card = project.createElement();
      if (!isRootPage) {
        card.addEventListener('click', () => this.showProjectDetail(project.slug));
      }
      grid.appendChild(card);
    });

    this.container.appendChild(grid);
  }

  async showProjectDetail(slug) {
    const project = this.projects.find(p => p.slug === slug);
    if (!project) return;

    history.pushState({ slug }, '', `${slug}`);

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
}

class MarkdownLoader {
  async loadProjects(projectFiles) {
    const projects = [];
    for (const file of projectFiles) {
      try {
        const response = await fetch(file);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const content = await response.text();
        const projectData = this.parseMarkdownProject(content, file);
        projects.push(new Project(projectData));
      } catch (error) {
        console.error(`Erreur lors du chargement de ${file}:`, error);
      }
    }
    return projects;
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
        metadata[currentKey] = value || [];
      }
    }

    if (metadata.publishDate) {
      metadata.publishDate = metadata.publishDate.replace(/["']/g, '');
    }

    // Ajoutez la catégorie en fonction des tags
    metadata.category = metadata.tags?.includes('Epitech') ? 'epitech' : 'personnel';

    return {
      ...metadata,
      content: contentStr,
      filePath,
      slug: this.createSlug(metadata.title || filePath.split('/').pop().replace('.md', ''))
    };
  }

  createSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const gallery = new ProjectGallery();
  const projectFiles = [
    './project/luvio.md',
    './project/my_cinema.md',
    './project/AFPExtented.md',
    './project/AFP.md',
    './project/snake_IA.md',
    './project/toolbox.md',
    './project/space-invader.md'
  ];
  gallery.loadProjects(projectFiles);
});
