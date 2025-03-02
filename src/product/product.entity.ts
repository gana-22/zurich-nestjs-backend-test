import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  product_code!: string;

  @Column({ type: "varchar", nullable: true }) // optionable column
  product_description: string | null | undefined;

  @Column()
  location!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: string;
}
