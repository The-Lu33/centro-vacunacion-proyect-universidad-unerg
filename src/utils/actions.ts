"use server"

import { v4 as uuidv4 } from "uuid"

const vaccineRecords: any[] = []

export async function addVaccineRecord(data: any) {
  const newRecord = {
    id: uuidv4(),
    ...data,
  }
  vaccineRecords.push(newRecord)
  return newRecord
}


