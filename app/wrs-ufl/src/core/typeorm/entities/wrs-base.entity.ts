import { Column, PrimaryColumn } from 'typeorm';
export class WRSBaseEntity {
    @PrimaryColumn({ name: 'id' })
    id: string;

    @Column({ name: 'wr_number', length: '8', nullable: false })
    wrNumber: string;

    @Column({ name: 'facility', length: '10', nullable: false })
    facility: string;

    @Column({ name: 'u_code', length: '6', nullable: true })
    uCode: string;

    @Column({ name: 'work_against_code', length: '1', nullable: true })
    workAgainstCode: string;

    @Column({ name: 'trouble_brkdwn', length: '1', nullable: true })
    troubleBrkdwn: string;

    @Column({ name: 'ops_review', length: '1', nullable: true })
    opsReview: string;

    @Column({ name: 'equip_group_type', length: '4', nullable: true })
    equipGroupType: string;

    @Column({ name: 'equip_class', length: '6', nullable: true })
    equipClass: string;

    @Column({ name: 'nuc_applicable_mode', length: '6', nullable: true })
    nucApplicableMode: string;

    @Column({ name: 'fid', length: '20', nullable: true })
    fid: string;

    @Column({ name: 'spv', length: '20', nullable: true })
    spv: string;

    @Column({ name: 'mrule', length: '20', nullable: true })
    mrule: string;

    @Column({ name: 'ist', length: '20', nullable: true })
    ist: string;

    @Column({ name: 'cda', length: '20', nullable: true })
    cda: string;

    @Column({ name: 'safe_sd', length: '20', nullable: true })
    safeSd: string;

    @Column({ name: 'e_plan', length: '20', nullable: true })
    ePlan: string;

    @Column({ name: 'fire_prot', length: '20', nullable: true })
    fireProt: string;

    @Column({ name: 'fire_prot2', length: '20', nullable: true })
    fireProt2: string;

    @Column({ name: 'appr_fire', length: '20', nullable: true })
    apprFire: string;

    @Column({ name: 'flex', length: '20', nullable: true })
    flex: string;

    @Column({ name: 'lic_renew', length: '20', nullable: true })
    licRenew: string;

    @Column({ name: 'equip_bin', length: '20', nullable: true })
    equipBin: string;

    @Column({ name: 'target_outage_ind', length: '1', nullable: true })
    targetOutageInd: string;

    @Column({ name: 'target_priority', length: '2', nullable: true })
    targetPriority: string;

    @Column({ name: 'e_code', length: '10', nullable: true })
    eCode: string;

    @Column({ name: 'equipment_number', length: '15', nullable: true })
    equipmentNumber: string;

    @Column({ name: 'equipment_name', length: '65', nullable: true })
    equipmentName: string;

    @Column({ name: 'equipment_type', length: '6', nullable: true })
    equipmentType: string;

    @Column({ name: 'system_code', length: '6', nullable: true })
    systemCode: string;

    @Column({ name: 'location_desc', length: '65', nullable: true })
    locationDesc: string;

    @Column({ name: 'description', length: '65536', nullable: true })
    description: string;

    @Column({ name: 'detailed_description', length: '65536', nullable: true })
    detailedDescription: string;

    @Column({ name: 'e_code_outage_yes', length: '20', nullable: true })
    eCodeOutageYes: string;

    @Column({ name: 'e_code_outage_no', length: '20', nullable: true })
    eCodeOutageNo: string;

    @Column({ name: 'equip_type_outage_yes', length: '20', nullable: true })
    equipTypeOutageYes: string;

    @Column({ name: 'equip_type_outage_no', length: '20', nullable: true })
    equipTypeOutageNo: string;

    @Column({ name: 'equip_group_id_outage_yes', length: '20', nullable: true })
    equipGroupIdOutageYes: string;

    @Column({ name: 'equip_group_id_outage_no', length: '20', nullable: true })
    equipGroupIdOutageNo: string;

    @Column({ name: 'e_code_trbl_brk_yes', length: '20', nullable: true })
    eCodeTrblBrkYes: string;

    @Column({ name: 'e_code_trbl_brk_no', length: '20', nullable: true })
    eCodeTrblBrkNo: string;

    @Column({ name: 'e_code_average_trbl_brk_12mo', length: '20', nullable: true })
    eCodeAverageTrblBrk12Mo: string;

    @Column({ name: 'e_code_max_trbl_brk_12mo', length: '20', nullable: true })
    eCodeMaxTrblBrk12Mo: string;

    @Column({ name: 'e_code_min_trbl_brk_12mo', length: '20', nullable: true })
    eCodeMinTrblBrk12Mo: string;

    @Column({ name: 'model_name', length: '20', nullable: false })
    modelName: string;

    @Column({ name: 'model_version', length: '20', nullable: false })
    modelVersion: string;

    @Column({ name: 'model_recommendation', length: '20', nullable: true })
    modelRecommendation: string;

    @Column({ name: 'model_probability', length: '20', nullable: true })
    modelProbability: string;

    @Column({ name: 'user_decision', length: '20', nullable: false })
    userDecision: string;

    @Column({ name: 'create_user_id', length: '10', nullable: false })
    createUserId: string;

    @Column({ name: 'update_user_id', length: '10', nullable: false })
    updateUserId: string;

    @Column({
        name: 'create_datetime',
        type: 'timestamp',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    createDateTime: Date;

    @Column({
        name: 'update_datetime',
        type: 'timestamp',
        nullable: false,
        default: () => 'CURRENT_TIMESTAMP',
    })
    updateDateTime: Date;
}
