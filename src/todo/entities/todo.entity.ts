import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  details: string;

  @Column('date') // This ensures that only a date (without time) can be stored.
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: ['pending', 'in-progress', 'paused', 'done'],
    default: 'pending',
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ['normal', 'medium', 'high'],
    default: 'normal',
  })
  priority: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  dateOfCreation: Date;

  @Column({ default: true })
  isActive: boolean;
}
