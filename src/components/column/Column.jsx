import { AddTodoButton } from '../button';
import styles from './Column.module.scss';

export default function Column({ children }) {
  const handleAddTodo = () => {
    console.log('add todo');
  };
  return (
    <div className={styles.column}>
      <AddTodoButton type="3" onClick={() => handleAddTodo()} />
      {children}
    </div>
  );
}
