function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    {
      id: 'today',
      label: 'Today',
      icon: (
        <svg viewBox="0 0 24 24">
          <rect x="3" y="4" width="18" height="18" rx="2" />
          <path d="M16 2v4M8 2v4M3 10h18" />
        </svg>
      ),
    },
    {
      id: 'stats',
      label: 'Stats',
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M18 20V10M12 20V4M6 20v-6" />
        </svg>
      ),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: (
        <svg viewBox="0 0 24 24">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
        </svg>
      ),
    },
  ]

  return (
    <nav className="bottom-nav">
      { tabs.map(tab => (
        <button
          key={ tab.id }
          className={ `nav-item ${ activeTab === tab.id ? 'active' : '' }` }
          onClick={ () => onTabChange(tab.id) }
        >
          { tab.icon }
          { tab.label }
        </button>
      )) }
    </nav>
  )
}

export default BottomNav
