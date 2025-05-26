import { beginCell, Cell, Dictionary } from '@ton/core';

const OFF_CHAIN_CONTENT_PREFIX = 0x01

export function flattenSnakeCell(cell: Cell) {
  let c: Cell | null = cell

  let res = Buffer.alloc(0)

  while (c) {
    const cs = c.beginParse()
    if (cs.remainingBits === 0) {
      return res
    }
    if (cs.remainingBits % 8 !== 0) {
      throw Error('Number remaining of bits is not multiply of 8')
    }

    const data = cs.loadBuffer(cs.remainingBits / 8)
    res = Buffer.concat([res, data])
    c = c.refs && c.refs[0]
  }

  return res
}

function bufferToChunks(buff: Buffer, chunkSize: number) {
  const chunks: Buffer[] = []
  while (buff.byteLength > 0) {
    chunks.push(buff.slice(0, chunkSize))
    buff = buff.slice(chunkSize)
  }
  return chunks
}

export function makeSnakeCell(data: Buffer): Cell {
  const chunks = bufferToChunks(data, 127)

  if (chunks.length === 0) {
    return beginCell().endCell()
  }

  if (chunks.length === 1) {
    return beginCell().storeBuffer(chunks[0]).endCell()
  }

  let curCell = beginCell()

  for (let i = chunks.length - 1; i >= 0; i--) {
    const chunk = chunks[i]

    curCell.storeBuffer(chunk)

    if (i - 1 >= 0) {
      const nextCell = beginCell()
      nextCell.storeRef(curCell)
      curCell = nextCell
    }
  }

  return curCell.endCell()
}

export function encodeOffChainContent(content: string) {
  let data = Buffer.from(content)
  const offChainPrefix = Buffer.from([OFF_CHAIN_CONTENT_PREFIX])
  data = Buffer.concat([offChainPrefix, data])
  return makeSnakeCell(data)
}

export function decodeOffChainContent(content: Cell) {
  const data = flattenSnakeCell(content)

  const prefix = data[0]
  if (prefix !== OFF_CHAIN_CONTENT_PREFIX) {
    throw new Error(`Unknown content prefix: ${prefix.toString(16)}`)
  }
  return data.slice(1).toString()
}

function storeRefString(value: string): Cell {
  return beginCell().storeBuffer(Buffer.from(value)).endCell();
}

export function jettonContentToCellOnchain(data: {
  name: string;
  symbol: string;
  description?: string;
  image?: string;
  decimals?: number;
}): Cell {
  const dict = Dictionary.empty(
      Dictionary.Keys.Buffer(64),
      Dictionary.Values.Cell()    
  );

  dict.set(Buffer.from("name"), storeRefString(data.name));
  dict.set(Buffer.from("symbol"), storeRefString(data.symbol));

  if (data.description) {
      dict.set(Buffer.from("description"), storeRefString(data.description));
  }

  if (data.image) {
      dict.set(Buffer.from("image"), storeRefString(data.image));
  }

  if (data.decimals !== undefined) {
      dict.set(Buffer.from("decimals"), storeRefString(data.decimals.toString()));
  }

  const metadataCell = beginCell();
  dict.store(metadataCell); 

  return beginCell()
      .storeUint(0, 8)               
      .storeRef(metadataCell.endCell()) 
      .endCell();
}
