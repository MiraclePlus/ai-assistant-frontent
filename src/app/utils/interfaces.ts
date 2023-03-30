interface ColumnDetail {
  uid: string | number
  column: string
  created_at: number
  active: boolean
  data: {
    prompt?: string
    answers?: string
    keywords?: string
  }
  updated_at: number
}

interface ColumnSample {
  uid: string | number
  column: string
  created_at: number
  table: string
  count: number
}

interface ColumnSampleEntry {
  uid: string
  column_sample_uid: string
  pk_id: number
  judgement: number
  created_at: number
  updated_at: number
  answer: {
    [key: string]: string
  }
}

export {
  ColumnDetail,
  ColumnSample,
  ColumnSampleEntry,
};
