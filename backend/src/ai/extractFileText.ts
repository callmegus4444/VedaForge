import path from 'path'
import fs from 'fs'
import axios from 'axios'

const RAG_URL = process.env.RAG_SERVICE_URL || 
                'http://127.0.0.1:5001'

export async function extractFileText(
  fileUrl: string
): Promise<string> {
  
  console.log('[EXTRACT] fileUrl:', fileUrl)
  
  const fileName = path.basename(fileUrl)
  const absolutePath = path.join(
    process.cwd(), 'uploads', fileName
  )
  const cleanPath = absolutePath.split('\\').join('/')
  
  console.log('[EXTRACT] path:', cleanPath)
  console.log('[EXTRACT] exists:', fs.existsSync(absolutePath))
  
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${cleanPath}`)
  }

  const response = await axios.post(
    `${RAG_URL}/extract`,
    { filePath: cleanPath },
    { 
      headers: { 'Content-Type': 'application/json' },
      timeout: 120000 
    }
  )

  if (!response.data.success) {
    throw new Error(response.data.error)
  }

  console.log('[EXTRACT] chars:', 
    response.data.context?.length)
  
  return response.data.context
}
