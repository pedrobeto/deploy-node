import { ObjectIdColumn, ObjectID, Entity, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('notifications')
export default class Notification {
    @ObjectIdColumn()
    id: ObjectID;

    @Column()
    content: string;

    @Column('v4')
    recipient_id: string;

    @Column({ default: false })
    read: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}