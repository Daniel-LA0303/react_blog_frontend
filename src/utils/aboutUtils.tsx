
export const icons = {
  blog: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  chat: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
  auth: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
  image: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  cloud: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
  tag: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  dashboard: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
}

export const features = [
  { icon: icons.blog,      title: 'Full blog CRUD',           desc: 'Create, edit, delete and browse posts with rich content via React Quill editor.' },
  { icon: icons.users,     title: 'Social layer',             desc: 'Follow users, like posts, save articles, and comment with threaded replies.' },
  { icon: icons.chat,      title: 'Real-time chat',           desc: 'WebSocket-powered DMs via Socket.IO with online presence and unread badges.' },
  { icon: icons.auth,      title: 'JWT authentication',       desc: 'Secure register/login flow with email verification through Mailtrap.' },
  { icon: icons.image,     title: 'Cloudinary uploads',       desc: 'Profile photos and post cover images stored and served via Cloudinary CDN.' },
  { icon: icons.search,    title: 'Search engine',            desc: 'Search posts, users, and categories with paginated results.' },
  { icon: icons.tag,       title: 'Category system',          desc: 'Follow categories and filter your feed by tags that interest you.' },
  { icon: icons.dashboard, title: 'User dashboard',           desc: 'Stats, saved posts, liked posts, followers, and following in one place.' },
]

export const stack = [
  'ReactJS', 'TypeScript', 'Redux', 'Framer Motion', 'TailwindCSS',
  'NodeJS', 'ExpressJS', 'MongoDB', 'Socket.IO', 'JWT',
  'Cloudinary', 'AWS EC2', 'Mailtrap', 'React Quill', 'Zustand',
]

export const sectionsPolicy = [
  {
    badge: 'Collection',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    title: 'What we collect',
    items: [
      'Name, email address, and password (hashed) on registration.',
      'Profile picture uploaded to Cloudinary CDN.',
      'Posts, comments, likes, saves, and follow relationships you create.',
      'Basic usage data such as last login time.',
    ],
  },
  {
    badge: 'Usage',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    title: 'How we use it',
    items: [
      'To authenticate you and personalise your feed and recommendations.',
      'To deliver email verification and password-reset messages via Mailtrap.',
      'To display your public profile, posts, and social activity to other users.',
      'We do not sell your data to third parties.',
    ],
  },
  {
    badge: 'Storage',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></svg>,
    title: 'Where data lives',
    items: [
      'User data and posts are stored in MongoDB Atlas.',
      'Images are hosted on Cloudinary CDN.',
      'The server runs on an AWS EC2 instance.',
      'Data is not transferred outside these services.',
    ],
  },
  {
    badge: 'Rights',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>,
    title: 'Your rights',
    items: [
      'You can update or delete your account at any time from settings.',
      'Deleting your account removes your posts, comments, and profile data.',
      'You can request a copy of your data by contacting us.',
    ],
  },
]

export const termsOfUse = [
  {
    badge: 'Eligibility',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    title: 'Who can use DLTechBlog',
    items: [
      'The platform is primarily intended for BUAP students, faculty, and the wider developer community.',
      'You must provide a valid email address to register.',
      'One account per person. Duplicate or impersonation accounts will be removed.',
    ],
  },
  {
    badge: 'Content',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: 'Your content',
    items: [
      'You retain ownership of content you publish on DLTechBlog.',
      'By posting, you grant DLTechBlog a non-exclusive licence to display your content on the platform.',
      'You are solely responsible for the accuracy and legality of what you post.',
      'We reserve the right to remove content that violates these terms.',
    ],
  },
  {
    badge: 'Prohibited',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>,
    title: 'Prohibited use',
    items: [
      'Do not use the platform to distribute malware, phishing links, or harmful code.',
      'Do not attempt to reverse-engineer, scrape, or abuse the API.',
      'Do not use automated bots or scripts to interact with the platform.',
      'Commercial advertising without permission is not allowed.',
    ],
  },
  {
    badge: 'Service',
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    title: 'Service availability',
    items: [
      'DLTechBlog is provided as-is as a social service academic project.',
      'We do not guarantee 100% uptime or uninterrupted access.',
      'We may update features, suspend accounts, or discontinue the service at any time.',
    ],
  },
]