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

  console.log('[EXTRACT] Calling RAG... URL:', `${RAG_URL}/extract`)
  console.log('[EXTRACT] Request Payload:', JSON.stringify({ filePath: cleanPath }))
  
  try {
    const response = await axios.post(
      `${RAG_URL}/extract`,
      { filePath: cleanPath },
      { 
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000 
      }
    )

    console.log('[EXTRACT] Response from RAG:', JSON.stringify({
      status: response.status,
      success: response.data?.success,
      contextLength: response.data?.context?.length
    }))

    if (!response.data.success) {
      throw new Error(response.data.error)
    }

    console.log('[EXTRACT] chars:', 
      response.data.context?.length)
    
    return response.data.context

  } catch (error: any) {
    console.error('[EXTRACT] RAG Call Error clearly:')
    if (error.response) {
      console.error('[EXTRACT] RAG Server responded with error status:', error.response.status)
      console.error('[EXTRACT] RAG Server error data:', JSON.stringify(error.response.data))
    } else if (error.request) {
      console.error('[EXTRACT] No response received from RAG service (Net timeout or down):', error.message)
    } else {
      console.error('[EXTRACT] Error setting up RAG request:', error.message)
    }
    throw error
  }
}
