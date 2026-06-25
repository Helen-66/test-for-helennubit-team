import type { ReactNode } from 'react';
import { useIsMobile } from '../hooks/useMediaQuery';

type TabId = 'list' | 'create';

interface BottomTabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  children?: ReactNode;
}

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: 'list', label: '日记', icon: '📋' },
  { id: 'create', label: '新建', icon: '✏️' },
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
