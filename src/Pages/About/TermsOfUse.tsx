import LegalPage, { LegalSection } from "../../components/About/LegalPage"

const sections: LegalSection[] = [
  {
    id: 'welcome',
    badge: 'Who this is for',
    title: 'A space for every field',
    items: [
      'DLTechBlog is open to people from any area of study, not just one field.',
      'You can write about, follow and discover topics across many different categories.',
      'Everyone is welcome to share knowledge, regardless of their background.',
    ],
  },
  {
    id: 'account',
    badge: 'Your account',
    title: 'Creating and using your account',
    items: [
      'You must provide accurate information when you sign up.',
      'You are responsible for keeping your account secure and for activity under it.',
      'You must be the one using your own account. Do not share it or impersonate others.',
    ],
  },
  {
    id: 'content',
    badge: 'Your content',
    title: 'What you create and share',
    intro: 'This includes posts, comments, quizzes, lists, projects and messages.',
    items: [
      'You own what you write and publish.',
      'By publishing, you allow DLTechBlog to display your content to other users on the platform.',
      'Your content should be respectful and should not mislead or harm others.',
      'You are responsible for having the right to share anything you publish, including images.',
    ],
  },
  {
    id: 'quizzes',
    badge: 'Quizzes',
    title: 'Quizzes and fair play',
    items: [
      'Create quizzes with accurate questions and answers.',
      'Take quizzes honestly. Results and leaderboards should reflect your own effort.',
      'Do not use extra accounts or other tricks to inflate your results or anyone else’s.',
    ],
  },
  {
    id: 'projects',
    badge: 'Projects',
    title: 'Projects and collaboration',
    items: [
      'Project owners decide who joins and are responsible for the people they invite.',
      'Collaborators should respect the work of others and the purpose of the project.',
      'Owners may remove collaborators, and collaborators may leave a project at any time.',
    ],
  },
  {
    id: 'ai',
    badge: 'AI tools',
    title: 'Using the AI features',
    items: [
      'AI-generated titles, summaries, quizzes and answers are suggestions and may contain mistakes.',
      'You are responsible for reviewing anything generated before you publish it.',
      'Do not use the AI tools to create content that goes against these terms.',
    ],
  },
  {
    id: 'badges',
    badge: 'Recognition',
    title: 'Badges',
    items: [
      'Badges recognize participation and achievements on the platform.',
      'Badges have no monetary value and may be added, adjusted or updated over time.',
      'Badges must be earned through genuine activity.',
    ],
  },
  {
    id: 'conduct',
    badge: 'Community',
    title: 'How we expect you to behave',
    items: [
      'Treat other users with respect in posts, comments and chat.',
      'No harassment, hate speech or spam.',
      'Report anything that makes the community feel unsafe.',
      'We may hide or remove content, or restrict accounts, when these terms are not followed.',
    ],
  },
  {
    id: 'changes',
    badge: 'Changes',
    title: 'Updates to these terms',
    items: [
      'We may update these terms from time to time as the platform grows.',
      'We will let you know if there are important changes.',
      'Continuing to use the platform means you accept the current terms.',
    ],
  },
]

const TermsOfUse = () => (
  <LegalPage
    eyebrow="Legal · DLTechBlog"
    title="Terms of use"
    intro="By using DLTechBlog you agree to these terms. Please read them carefully. They describe what you can do on the platform and what we expect from everyone."
    updated="October 2026"
    sections={sections}
    footnote="Questions? Contact us through the platform chat or your profile settings."
  />
)

export default TermsOfUse