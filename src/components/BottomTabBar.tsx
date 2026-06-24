interface BottomTabBarProps {
  currentView: string;
  onNavigate: (view: 'list' | 'create') => void;
}

export default function BottomTabBar({ currentView, onNavigate }: BottomTabBarProps) {
  return (
    <nav className="bottom-tab-bar" aria-label="底部导航">
      <button
        type="button"
        className={`tab-item ${currentView === 'list' ? 'tab-item--active' : ''}`}
        onClick={() => onNavigate('list')}
      >
        <span className="tab-icon">📋</span>
        <span className="tab-label">日记</span>
      </button>
      <button
        type="button"
        className={`tab-item tab-item--create ${currentView === 'create' ? 'tab-item--active' : ''}`}
        onClick={() => onNavigate('create')}
      >
        <span className="tab-icon tab-icon--plus">+</span>
        <span className="tab-label">新建</span>
      </button>
    </nav>
  );
}
