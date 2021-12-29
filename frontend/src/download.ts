import { getAuth } from './auth-provider'

const baseUrl = process.env.GRAPHQL_URL || 'http://localhost:4000'

export default function download(url: string, filename: string): Promise<void> {
  const { token } = getAuth()

  return fetch(`${baseUrl}${url}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }).then((res) =>
    res.blob().then((blob) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link?.parentNode?.removeChild(link)
    }),
  )
}
