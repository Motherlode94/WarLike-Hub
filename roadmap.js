// Modules de la gamme WarLike : feuille de route, aucun service fictif ni URL inventée.
export const plannedModules=[
  {
    "id": "qa-lab",
    "name": "WarLike QA Lab",
    "description": "Tests automatiques, crashs, performances et contrôles avant déploiement",
    "priority": "P0",
    "status": "planned"
  },
  {
    "id": "desktop",
    "name": "WarLike Desktop / Launcher",
    "description": "Installation, mises à jour et ouverture des applications WarLike",
    "priority": "P1",
    "status": "planned"
  },
  {
    "id": "plugin-lab",
    "name": "WarLike Plugin Lab",
    "description": "Création et validation d'instruments et effets audio",
    "priority": "P1",
    "status": "planned"
  },
  {
    "id": "material-lab",
    "name": "WarLike Material Lab",
    "description": "Peinture PBR, UV, normal maps, baking et matériaux procéduraux",
    "priority": "P1",
    "status": "planned"
  },
  {
    "id": "motion-studio",
    "name": "WarLike Motion Studio",
    "description": "Capture et nettoyage des mouvements, IK et retargeting",
    "priority": "P2",
    "status": "planned"
  },
  {
    "id": "devkit",
    "name": "WarLike DevKit",
    "description": "SDK, API, documentation et outils pour les extensions",
    "priority": "P1",
    "status": "planned"
  },
  {
    "id": "cloud",
    "name": "WarLike Cloud",
    "description": "Versions, sauvegardes et synchronisation sécurisée des projets",
    "priority": "P0",
    "status": "planned"
  },
  {
    "id": "support",
    "name": "WarLike Support",
    "description": "Base de connaissances et suivi d'incidents",
    "priority": "P1",
    "status": "planned"
  },
  {
    "id": "publish",
    "name": "WarLike Publish",
    "description": "Publication contrôlée des jeux, musiques, livres et vidéos",
    "priority": "P2",
    "status": "planned"
  },
  {
    "id": "analytics",
    "name": "WarLike Analytics",
    "description": "Tableaux de bord d'utilisation, qualité et revenus",
    "priority": "P2",
    "status": "planned"
  }
];
export function renderRoadmap(target=document.getElementById('warlike-roadmap')) {
 if(!target)return;
 const list=target.querySelector('[data-roadmap-list]');if(!list)return;
 list.replaceChildren();
 for(const module of plannedModules){
  const article=document.createElement('article');article.className='roadmapCard';
  const top=document.createElement('div');top.className='roadmapMeta';
  const priority=document.createElement('span');priority.textContent=module.priority;
  const status=document.createElement('span');status.textContent=module.id==='qa-lab'?'Bêta disponible':'À développer';
  top.append(priority,status);
  const heading=document.createElement('h3');heading.textContent=module.name;
  const desc=document.createElement('p');desc.textContent=module.description;
  article.append(top,heading,desc);
  if(module.id==='qa-lab'){const link=document.createElement('a');link.href='./qa-lab.html';link.textContent='Ouvrir QA Lab ↗';link.className='roadmapLaunch';article.append(link);}
  list.append(article);
 }
}
if (typeof document !== 'undefined') renderRoadmap();
