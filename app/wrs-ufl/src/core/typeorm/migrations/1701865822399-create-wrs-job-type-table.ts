import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateWrsJobTypeTable1701865822399 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE ds_transactional.wrs_job_type (
                id VARCHAR NOT NULL PRIMARY KEY,
                wr_number VARCHAR(8) NOT NULL,
                facility VARCHAR(10) NOT NULL,
                u_code VARCHAR(6) NULL,
                work_against_code VARCHAR(1) NULL,
                trouble_brkdwn VARCHAR(1) NULL,
                ops_review VARCHAR(1) NULL,
                equip_group_type VARCHAR(4) NULL,
                equip_class VARCHAR(6) NULL,
                nuc_applicable_mode VARCHAR(6) NULL,
                fid VARCHAR(20) NULL,
                spv VARCHAR(20) NULL,
                mrule VARCHAR(20) NULL,
                ist VARCHAR(20) NULL,
                cda VARCHAR(20) NULL,
                safe_sd VARCHAR(20) NULL,
                e_plan VARCHAR(20) NULL,
                fire_prot VARCHAR(20) NULL,
                fire_prot2 VARCHAR(20) NULL,
                appr_fire VARCHAR(20) NULL,
                flex VARCHAR(20) NULL,
                lic_renew VARCHAR(20) NULL,
                equip_bin VARCHAR(20) NULL,
                target_outage_ind VARCHAR(1) NULL,
                target_priority VARCHAR(2) NULL,
                e_code VARCHAR(10) NULL,
                equipment_number VARCHAR(15) NULL,
                equipment_name VARCHAR(65) NULL,
                equipment_type VARCHAR(6) NULL,
                system_code VARCHAR(6) NULL,
                location_desc VARCHAR(65) NULL,
                description VARCHAR(65536) NULL,
                detailed_description VARCHAR(65536) NULL,
                e_code_outage_yes VARCHAR(20) NULL,
                e_code_outage_no VARCHAR(20) NULL,
                equip_type_outage_yes VARCHAR(20) NULL,
                equip_type_outage_no VARCHAR(20) NULL,
                equip_group_id_outage_yes VARCHAR(20) NULL,
                equip_group_id_outage_no VARCHAR(20) NULL,
                e_code_trbl_brk_yes VARCHAR(20) NULL,
                e_code_trbl_brk_no VARCHAR(20) NULL,
                e_code_average_trbl_brk_12mo VARCHAR(20) NULL,
                e_code_max_trbl_brk_12mo VARCHAR(20) NULL,
                e_code_min_trbl_brk_12mo VARCHAR(20) NULL,
                model_name VARCHAR(20) NOT NULL,
                model_version VARCHAR(10) NOT NULL,
                model_recommendation VARCHAR(20) NULL,
                model_probability VARCHAR(20) NOT NULL,
                user_decision VARCHAR(20) NOT NULL,
                create_user_id VARCHAR(10) NOT NULL,
                update_user_id VARCHAR(10) NOT NULL,
                create_datetime TIMESTAMP NOT NULL,
                update_datetime TIMESTAMP NOT NULL
            );

            COMMENT ON TABLE ds_transactional.wrs_job_type IS 'WRS table used for outage, discipline, priority, job type and ucr AI ML models. Shows the model recommendations and whether user accepted the values.';

            COMMENT ON COLUMN ds_transactional.wrs_job_type.id IS 'Unique identification number for each record';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.wr_number IS 'Work Request number';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.facility IS 'Facility where the work request is applicable';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.u_code IS 'U CODE of the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.work_against_code IS 'Code representing work against specifications';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.trouble_brkdwn IS 'Details of any trouble or breakdown associated with the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.ops_review IS 'Details of operations review for the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.equip_group_type IS 'Type of equipment group associated with the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.equip_class IS 'Class of equipment related to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.nuc_applicable_mode IS 'Applicable mode for nuclear';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.fid IS 'Functional Importance Determination used in the model for this work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.spv IS 'Single Point Vulnerability used in the model for this work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.mrule IS 'Maintenance Rule applicable to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.ist IS 'In Service Testing applicable to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.cda IS 'Critical Digital Asset applicable to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.safe_sd IS 'Safe Shutdown applicable to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.e_plan IS 'Emergency Plan associated with the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.fire_prot IS 'Fire protection applicable to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.fire_prot2 IS 'Fire protection 2 applicable to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.appr_fire IS 'Appendix R Fire Regulation applicable to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.flex IS 'Flexible strategy for a beyond design basis event applicable to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.lic_renew IS 'License Renew related to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.equip_bin IS 'Equipment bin related to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.target_outage_ind IS 'Indicator for target outage related to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.target_priority IS 'Priority level of the target associated with the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.e_code IS 'Equipment Code associated with the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.equipment_number IS 'Number of the equipment related to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.equipment_name IS 'Name of the equipment related to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.equipment_type IS 'Type of the equipment related to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.system_code IS 'System code used in the model for the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.location_desc IS 'Description of the location related to the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.description IS 'General description of the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.detailed_description IS 'Detailed description of the work request';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.e_code_outage_yes IS 'Quantity of occurrences where the e_code_outage is applicable';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.e_code_outage_no IS 'Quantity of occurrences where the e_code_outage is not applicable';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.equip_type_outage_yes IS 'Quantity of occurrences where the equip_type_outage is applicable';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.equip_type_outage_no IS 'Quantity of occurrences where the equip_type_outage is not applicable';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.equip_group_id_outage_yes IS 'Quantity of occurrences where the equipment group ID is applicable';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.equip_group_id_outage_no IS 'Quantity of occurrences where the equipment group ID is not applicable';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.e_code_trbl_brk_yes IS 'Quantity of occurrences indicating trouble or breakdown associated with the E code';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.e_code_trbl_brk_no IS 'Quantity of occurrences indicating no trouble or breakdown associated with the E code';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.e_code_average_trbl_brk_12mo IS 'Average number of trouble of breakdowns associated with the E code in the last 12 months';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.e_code_max_trbl_brk_12mo IS 'Maximum number of trouble of breakdowns associated with the E code in the last 12 months';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.e_code_min_trbl_brk_12mo IS 'Min number of trouble of breakdowns associated with the E code in the last 12 months';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.model_name IS 'Name of the AI model used for generating recommendations';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.model_version IS 'Version of the AI model used';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.model_recommendation IS 'Recommendation generated by the AI model';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.model_probability IS 'Probability or likelihood of the recommendation generated by the AI model';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.user_decision IS 'User final determination for the model recommendation';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.create_user_id IS 'User ID of the person who created the record';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.update_user_id IS 'User ID of the person who last updated the record';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.create_datetime IS 'Timestamp indicating when the record was created';
            COMMENT ON COLUMN ds_transactional.wrs_job_type.update_datetime IS 'Timestamp indicating when the record was last updated';

            CREATE INDEX idx_wrs_job_type_wr_number ON ds_transactional.wrs_job_type USING btree (wr_number);

            ALTER TABLE ds_transactional.wrs_job_type
              ADD CONSTRAINT unique_wrs_job_type
              UNIQUE (wr_number, model_name, model_version);

              GRANT SELECT ON ds_transactional.wrs_job_type TO ds_transactional_select_role;
    
              GRANT UPDATE, DELETE, INSERT ON TABLE ds_transactional.wrs_job_type TO ds_transactional_dml_role;
    
              GRANT UPDATE, DELETE, INSERT, TRUNCATE, REFERENCES, SELECT, TRIGGER ON TABLE ds_transactional.wrs_job_type TO ds_transactional_all_privs_role;
      `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE IF EXISTS ds_transactional.wrs_job_type;`);
    }
}
