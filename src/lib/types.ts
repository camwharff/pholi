export type SizeType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16
export type GridCell = BlockCell | SizeCell | ContentCell | null
export type GridMatrix = GridCell[][]

export interface ContentCell {
    id: string
    width: SizeType
    height: SizeType
    kind: string
    label?: string
    url?: string
    description?: string
    type?: string
    coverId?: string
    coverUrl?: string
}

export interface MediaCell extends ContentCell {
    label: string
    description: string
    url: string
    type: string
    coverUrl?: string
    coverId?: string
    kind: 'media'
}

export interface FillCell extends ContentCell {
    kind: 'filler'
}

export interface TextCell extends ContentCell {
    label: string
    description: string
    kind: 'text'
}

export interface BlockCell {
    id: 'block'
    ownerId: string
    kind: 'block'
}

export interface SizeCell {
    id: string
    ownerId: string
    kind: 'size'
}

export interface MediaRaw {
    id: string
    path: string
    timeStamp: number
    type: string
    label?: string
    description?: string
    date?: string
    cover?: string
}

export interface NewMedia {
    file: File
    type: string
    url: string
    title?: string
    date?: string
    description?: string
    cover?: File
}