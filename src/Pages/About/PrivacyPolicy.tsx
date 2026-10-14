import LegalPage, { LegalSection } from "../../components/About/LegalPage"


const sections: LegalSection[] = [
  {
    id: 'collect',
    badge: 'Data we collect',
    title: 'Information we collect',
    intro: 'We only collect what we need to make the platform work and to personalize your experience.',
    items: [
      'Your profile: name, email, photo and any biography or personal details you choose to add.',
      'If you sign in with Google, the basic information Google shares with us: your name, email and profile photo.',
      'What you create: posts, comments, replies, quizzes, lists and projects.',
      'Your activity: what you like, save and follow, plus your quiz attempts, results and badges.',
      'Messages and images you send through chat.',
      'Your recent searches, so search feels faster and recommendations feel more relevant.',
    ],
  },
  {
    id: 'use',
    badge: 'How we use it',
    title: 'How we use your information',
    items: [
      'To show you content, people and categories you may enjoy.',
      'To let others find your profile and connect with you.',
      'To notify you when someone interacts with your posts, comments, projects or messages.',
      'To calculate quiz results and leaderboards, and to award badges for your achievements.',
      'To keep projects in sync so every collaborator sees the latest changes.',
      'To send emails about important account actions, such as confirming your account or recovering your password.',
      'To keep your account and the community secure.',
    ],
  },
  {
    id: 'visibility',
    badge: 'Who can see what',
    title: 'Your content and visibility',
    items: [
      'Your profile, published posts and public comments can be seen by other users.',
      'Quiz results may appear in leaderboards next to other participants.',
      'Badges are shown on your profile, and you can choose to show or hide them.',
      'Your lists are personal. Your projects are visible only to you and the people you invite.',
      'Chat messages are visible only to the people in the conversation.',
      'When you delete a post, it stops being visible to everyone right away.',
    ],
  },
  {
    id: 'ai',
    badge: 'AI tools',
    title: 'Using the AI features',
    intro: 'AI tools only run when you choose to use them.',
    items: [
      'When you ask for a summary, a title, a quiz or an answer about a post, the relevant content and your question are sent to an AI service to produce the result.',
      'Please avoid including sensitive personal information in the questions you ask.',
      'AI responses are suggestions. Review them before you publish or rely on them.',
    ],
  },
  {
    id: 'collaboration',
    badge: 'Working with others',
    title: 'Projects and collaboration',
    items: [
      'Collaborators can see the lists, tasks and recent activity of the projects they belong to.',
      'When you search for people to invite, only public profile information is shown.',
      'Project owners can remove collaborators at any time.',
    ],
  },
  {
    id: 'control',
    badge: 'Your control',
    title: 'Managing your data',
    items: [
      'Update or correct your personal information from your profile at any time.',
      'Unfollow, unsave, unlike or remove your activity whenever you want.',
      'Edit or delete your posts, quizzes, lists and projects.',
      'Choose which badges appear on your profile.',
      'Request to close your account and remove your data.',
    ],
  },
  {
    id: 'security',
    badge: 'Staying safe',
    title: 'How we protect your account',
    items: [
      'Your password is never visible to anyone, including our team.',
      'We verify your email to help keep your account secure.',
      'You can recover access with your email if you forget your password.',
      'If you notice anything suspicious, let us know so we can help.',
    ],
  },
]

const PrivacyPolicy = () => (
  <LegalPage
    eyebrow="Legal · DLTechBlog"
    title="Privacy policy"
    intro="This page explains what information we collect, how we use it and the control you have over your data."
    updated="October 2026"
    sections={sections}
    footnote="Questions about your data? Reach out through the platform chat or your profile page."
  />
)

export default PrivacyPolicy