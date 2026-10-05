import './consumer.css';
import ConsumerShell from './consumer-shell';

export default function ConsumerLayout({ children }) {
  return <ConsumerShell>{children}</ConsumerShell>;
}