import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1738869107988 implements MigrationInterface {
  name = 'Migration1738869107988';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`TLB_SECRETARIA\` (\`SEC_ID\` int NOT NULL AUTO_INCREMENT, \`SEC_NOMBRE\` varchar(60) NOT NULL, PRIMARY KEY (\`SEC_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`TBL_USUARIO\` (\`USU_ID\` int NOT NULL AUTO_INCREMENT, \`USU_NOMBRE\` varchar(60) NOT NULL, \`USU_APELLIDOS\` varchar(60) NOT NULL, \`USU_CORREO\` varchar(100) NOT NULL, \`USU_TELEFONO\` bigint NOT NULL, \`USU_ROL\` varchar(10) NOT NULL, PRIMARY KEY (\`USU_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`TBL_SOLICITUD\` (\`SOL_ID\` int NOT NULL AUTO_INCREMENT, \`SOL_HORA_INICIO\` time NOT NULL, \`SOL_HORA_FIN\` time NOT NULL, \`SOL_FECHA_RESERVA\` date NOT NULL, \`SOL_FECHA_SOLICITUD\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`SOL_NUMERO_ASISTENTES\` int NOT NULL, \`SOL_PROPOSITO\` varchar(255) NOT NULL, \`SOL_PORTATIL\` tinyint NOT NULL, \`SOL_HDMI\` tinyint NOT NULL, \`SOL_ESTADO\` tinyint NOT NULL, \`SOL_SAL_ID\` int NULL, \`SOL_SEC_ID\` int NULL, \`SOL_USU_ID\` int NULL, PRIMARY KEY (\`SOL_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`TBL_SALA\` (\`SAL_ID\` int NOT NULL AUTO_INCREMENT, \`SAL_CAPACIDAD\` int NOT NULL, PRIMARY KEY (\`SAL_ID\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`TBL_SOLICITUD\` ADD CONSTRAINT \`FK_c53a9db91926282067d2625f253\` FOREIGN KEY (\`SOL_SAL_ID\`) REFERENCES \`TBL_SALA\`(\`SAL_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`TBL_SOLICITUD\` ADD CONSTRAINT \`FK_bf12ebf18c7ff877514b44cf3c4\` FOREIGN KEY (\`SOL_SEC_ID\`) REFERENCES \`TLB_SECRETARIA\`(\`SEC_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`TBL_SOLICITUD\` ADD CONSTRAINT \`FK_308a4c0c31b59de700be7ad6635\` FOREIGN KEY (\`SOL_USU_ID\`) REFERENCES \`TBL_USUARIO\`(\`USU_ID\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`TBL_SOLICITUD\` DROP FOREIGN KEY \`FK_308a4c0c31b59de700be7ad6635\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`TBL_SOLICITUD\` DROP FOREIGN KEY \`FK_bf12ebf18c7ff877514b44cf3c4\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`TBL_SOLICITUD\` DROP FOREIGN KEY \`FK_c53a9db91926282067d2625f253\``,
    );
    await queryRunner.query(`DROP TABLE \`TBL_SALA\``);
    await queryRunner.query(`DROP TABLE \`TBL_SOLICITUD\``);
    await queryRunner.query(`DROP TABLE \`TBL_USUARIO\``);
    await queryRunner.query(`DROP TABLE \`TLB_SECRETARIA\``);
  }
}
