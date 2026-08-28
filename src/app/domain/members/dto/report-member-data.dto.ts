import { MaritalStatus, TypeUser } from "../../auth";

export interface ReportSummaryDTO {
    total: number;
    active: number;
    inactive: number;
    baptized: number;
    notBaptized: number;
}

export interface ReportByTypeDTO {
    type: TypeUser;
    count: number;
    percentage: number;
}

export interface ReportStatusDTO {
    count: number;
    percentage: number;
}

export interface ReportMaritalStatusDTO {
    status: MaritalStatus;
    count: number;
}

export interface ReportRoleDTO {
    role: string;
    count: number;
}

export interface ReportDataMemberDTO {
    summary: ReportSummaryDTO;

    byType: ReportByTypeDTO[];

    byActiveStatus: {
        active: ReportStatusDTO;
        inactive: ReportStatusDTO;
    };

    byBaptismStatus: {
        baptized: ReportStatusDTO;
        notBaptized: ReportStatusDTO;
    };

    byMaritalStatus: ReportMaritalStatusDTO[];

    byRole: ReportRoleDTO[];
}
