import { MigrationInterface, QueryRunner } from 'typeorm';

export class Default1731029476447 implements MigrationInterface {
  name = 'Default1731029476447';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`cars\` (\`id\` varchar(36) NOT NULL, \`plate\` varchar(7) NOT NULL, \`brand\` varchar(45) NOT NULL, \`model\` varchar(90) NOT NULL, \`mileage\` int UNSIGNED NOT NULL DEFAULT '0', \`year\` int NOT NULL, \`items\` varchar(255) NOT NULL, \`daily_price\` decimal(10,2) NOT NULL, \`status\` enum ('active', 'inactive', 'deleted') NOT NULL, \`registration_date\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_time\` datetime NULL ON UPDATE CURRENT_TIMESTAMP, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`Order\` (\`id\` varchar(36) NOT NULL, \`dateRequest\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`statusRequest\` enum ('open', 'approved', 'closed', 'cancelled') NOT NULL, \`cep\` varchar(255) NULL, \`city\` varchar(255) NULL, \`uf\` varchar(255) NULL, \`rentalTax\` decimal(10,2) NOT NULL DEFAULT '0.00', \`totalValue\` decimal(10,2) NOT NULL DEFAULT '0.00', \`startDate\` timestamp NULL, \`endDate\` timestamp NULL, \`cancelDate\` timestamp(6) NULL, \`finishDate\` timestamp(6) NULL DEFAULT CURRENT_TIMESTAMP(6), \`fine\` decimal NOT NULL DEFAULT '0', \`customerId\` varchar(36) NOT NULL, \`carId\` varchar(36) NOT NULL, UNIQUE INDEX \`REL_0f88449168b8ffae36cb3f8a14\` (\`customerId\`), UNIQUE INDEX \`REL_4e45520de94d82e3dce3b5d561\` (\`carId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`customers\` (\`id\` varchar(36) NOT NULL, \`fullName\` varchar(100) NOT NULL, \`birthDate\` date NOT NULL, \`cpf\` varchar(14) NOT NULL, \`email\` varchar(100) NOT NULL, \`phone\` varchar(20) NOT NULL, \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`deletedAt\` timestamp(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order\` ADD CONSTRAINT \`FK_0f88449168b8ffae36cb3f8a140\` FOREIGN KEY (\`customerId\`) REFERENCES \`customers\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order\` ADD CONSTRAINT \`FK_4e45520de94d82e3dce3b5d5614\` FOREIGN KEY (\`carId\`) REFERENCES \`cars\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`Order\` DROP FOREIGN KEY \`FK_4e45520de94d82e3dce3b5d5614\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`Order\` DROP FOREIGN KEY \`FK_0f88449168b8ffae36cb3f8a140\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`customers\``);
    await queryRunner.query(
      `DROP INDEX \`REL_4e45520de94d82e3dce3b5d561\` ON \`Order\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_0f88449168b8ffae36cb3f8a14\` ON \`Order\``,
    );
    await queryRunner.query(`DROP TABLE \`Order\``);
    await queryRunner.query(`DROP TABLE \`cars\``);
  }
}
