import { IsNotEmpty, IsString } from 'class-validator';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidade para representar tenants no banco de dados.
 */
@Entity({ schema: 'public', name: 'tenants' })
export class Tenant {
  /**
   * Identificador único do tenant.
   */
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * Nome do tenant.
   */
  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  name!: string;

  /**
   * Nome do parent do tenant (opcional).
   */
  @Column({ nullable: true })
  @IsString()
  parent?: string;

  /**
   * Data de criação do registro.
   */
  @CreateDateColumn()
  createdAt!: Date;

  /**
   * Data da última atualização do registro.
   */
  @UpdateDateColumn()
  updatedAt!: Date;
}
