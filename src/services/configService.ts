export interface AppConfig {
  API_URL: string
  FRONTEND_URL: string
  DEFAULT_LANGUAGE: string
  SUPPORTED_LANGUAGES: string[]
  JWT_SECRET: string
}

export interface SparkMeta {
  templateVersion: number
  dbType: string
  variables: AppConfig
  lastSync: string
}

export class ConfigService {
  static async loadConfig(): Promise<AppConfig | null> {
    try {
      const config = await window.spark.kv.get<AppConfig>('app-config')
      return config || null
    } catch (error) {
      console.error('Failed to load config:', error)
      return null
    }
  }

  static async saveConfig(config: AppConfig): Promise<void> {
    try {
      await window.spark.kv.set('app-config', config)
    } catch (error) {
      console.error('Failed to save config:', error)
      throw error
    }
  }

  static exportToJson(config: AppConfig): SparkMeta {
    return {
      templateVersion: 1,
      dbType: 'kv',
      variables: config,
      lastSync: new Date().toISOString()
    }
  }

  static importFromJson(sparkMeta: SparkMeta): AppConfig | null {
    if (!sparkMeta.variables) {
      return null
    }
    return sparkMeta.variables
  }

  static downloadJson(sparkMeta: SparkMeta, filename: string = 'spark.meta.json'): void {
    const dataStr = JSON.stringify(sparkMeta, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  static getDefaultConfig(): AppConfig {
    return {
      API_URL: 'http://localhost:9090',
      FRONTEND_URL: 'http://localhost:3000',
      DEFAULT_LANGUAGE: 'ar',
      SUPPORTED_LANGUAGES: ['ar', 'en'],
      JWT_SECRET: ''
    }
  }
}
