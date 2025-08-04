export interface MetricData {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  onPress?: () => void;
}

export interface ActionData {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export interface HeaderProps {
  userName?: string;
  profileImage?: string;
  notificationCount?: number;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}
