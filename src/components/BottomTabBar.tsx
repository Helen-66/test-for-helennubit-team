import type { AppTab } from '../types/navigation';
import { useIsMobile } from '../hooks/useMediaQuery';

interface BottomTabBarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const tabs: { id: AppTab; label: string; icon: string }[] = [
  { id: 'diary', label: '日记', icon: '📋' },
  { id: 'create', label: '新建', icon: '✏️' },
  { id: 'pets', label: '宠物', icon: '🐾' },
];

export default function BottomTabBar({ activeTab, onTabChange }: BottomTabBarProps) {
  const isMobile = useIsMobile();
  if (!isMobile) return null;

  return (
    <nav className="bottom-tab-bar" role="tablist" aria-label="主导航">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={activeTab === tab.id}
          className={`tab-item ${activeTab === tab.id ? 'tab-item--active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          <span className="tab-item__icon">{tab.icon}</span>
          <span className="tab-item__label">{tab.label}</span>
        </button>
      ))}
    </nav>
  );
}
