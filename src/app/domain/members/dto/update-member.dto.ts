export interface UpdateMemberDTO {
    id: string;
    position_id: string | null;
    is_active: boolean | null;
    is_baptized: boolean | null;
    user_id: string | null;
    type: number | null;
}
