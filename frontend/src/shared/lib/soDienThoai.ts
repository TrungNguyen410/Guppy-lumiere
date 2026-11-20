/** Khớp với SoDienThoai.REGEX ở backend: số di động 10 số, đầu số 03, 05, 07, 08, 09. */
export const MAU_SDT = '0[35789][0-9]{8}'

export const REGEX_SDT = new RegExp(`^${MAU_SDT}$`)

export const LOI_SDT = 'Số di động gồm 10 số, đầu số 03, 05, 07, 08 hoặc 09'
