import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useKV } from '@github/spark/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Download, Upload, FloppyDisk, ArrowClockwise } from '@phosphor-icons/react'

interface AppConfig {
  API_URL: string
  FRONTEND_URL: string
  DEFAULT_LANGUAGE: string
  SUPPORTED_LANGUAGES: string[]
  JWT_SECRET: string
}

interface SparkMeta {
  templateVersion: number
  dbType: string
  variables: AppConfig
  lastSync: string
}

export function Settings() {
  const { t } = useTranslation()
  const [config, setConfig] = useKV<AppConfig>('app-config', {
    API_URL: 'http://localhost:9090',
    FRONTEND_URL: 'http://localhost:3000',
    DEFAULT_LANGUAGE: 'ar',
    SUPPORTED_LANGUAGES: ['ar', 'en'],
    JWT_SECRET: ''
  })

  const [formData, setFormData] = useState<AppConfig>(config || {
    API_URL: 'http://localhost:9090',
    FRONTEND_URL: 'http://localhost:3000',
    DEFAULT_LANGUAGE: 'ar',
    SUPPORTED_LANGUAGES: ['ar', 'en'],
    JWT_SECRET: ''
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (config) {
      setFormData(config)
    }
  }, [config])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      setConfig(formData)
      toast.success(t('settings.saved') || '✅ Configuration saved successfully')
    } catch (error) {
      toast.error(t('settings.saveFailed') || 'Failed to save configuration')
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportToSparkMeta = () => {
    try {
      const sparkMeta: SparkMeta = {
        templateVersion: 1,
        dbType: 'kv',
        variables: formData,
        lastSync: new Date().toISOString()
      }

      const dataStr = JSON.stringify(sparkMeta, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'spark.meta.json'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success(t('settings.exported') || '✅ Configuration exported to spark.meta.json')
    } catch (error) {
      toast.error(t('settings.exportFailed') || 'Failed to export configuration')
    }
  }

  const handleImportFromFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const parsed = JSON.parse(text) as SparkMeta
      
      if (parsed.variables) {
        setFormData(parsed.variables)
        setConfig(parsed.variables)
        toast.success(t('settings.imported') || '✅ Configuration imported successfully')
      } else {
        toast.error(t('settings.invalidFormat') || 'Invalid file format')
      }
    } catch (error) {
      toast.error(t('settings.importFailed') || 'Failed to import configuration')
    }
    
    event.target.value = ''
  }

  const handleReset = () => {
    const defaultConfig: AppConfig = {
      API_URL: 'http://localhost:9090',
      FRONTEND_URL: 'http://localhost:3000',
      DEFAULT_LANGUAGE: 'ar',
      SUPPORTED_LANGUAGES: ['ar', 'en'],
      JWT_SECRET: ''
    }
    setFormData(defaultConfig)
    toast.info(t('settings.reset') || 'Configuration reset to defaults')
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">{t('settings.title') || 'Settings'}</h1>
        <p className="text-muted-foreground mt-2">
          {t('settings.description') || 'Manage application configuration and environment variables'}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.environmentVariables') || 'Environment Variables'}</CardTitle>
          <CardDescription>
            {t('settings.envDescription') || 'Configure application settings and API endpoints'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="api-url">{t('settings.apiUrl') || 'API URL'}</Label>
              <Input
                id="api-url"
                value={formData.API_URL}
                onChange={(e) => setFormData({ ...formData, API_URL: e.target.value })}
                placeholder="http://localhost:9090"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frontend-url">{t('settings.frontendUrl') || 'Frontend URL'}</Label>
              <Input
                id="frontend-url"
                value={formData.FRONTEND_URL}
                onChange={(e) => setFormData({ ...formData, FRONTEND_URL: e.target.value })}
                placeholder="http://localhost:3000"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="default-language">{t('settings.defaultLanguage') || 'Default Language'}</Label>
              <Input
                id="default-language"
                value={formData.DEFAULT_LANGUAGE}
                onChange={(e) => setFormData({ ...formData, DEFAULT_LANGUAGE: e.target.value })}
                placeholder="ar"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="supported-languages">{t('settings.supportedLanguages') || 'Supported Languages (comma-separated)'}</Label>
              <Input
                id="supported-languages"
                value={formData.SUPPORTED_LANGUAGES.join(', ')}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  SUPPORTED_LANGUAGES: e.target.value.split(',').map(lang => lang.trim()) 
                })}
                placeholder="ar, en"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="jwt-secret">{t('settings.jwtSecret') || 'JWT Secret'}</Label>
              <Input
                id="jwt-secret"
                type="password"
                value={formData.JWT_SECRET}
                onChange={(e) => setFormData({ ...formData, JWT_SECRET: e.target.value })}
                placeholder="your-secret-key"
              />
            </div>
          </div>

          <Separator />

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} disabled={isSaving}>
              <FloppyDisk className="mr-2" />
              {isSaving ? (t('settings.saving') || 'Saving...') : (t('settings.save') || 'Save Configuration')}
            </Button>

            <Button onClick={handleExportToSparkMeta} variant="secondary">
              <Download className="mr-2" />
              {t('settings.export') || 'Export to spark.meta.json'}
            </Button>

            <Button variant="secondary" asChild>
              <label htmlFor="import-file" className="cursor-pointer">
                <Upload className="mr-2" />
                {t('settings.import') || 'Import from File'}
              </label>
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".json"
              className="hidden"
              onChange={handleImportFromFile}
            />

            <Button onClick={handleReset} variant="outline">
              <ArrowClockwise className="mr-2" />
              {t('settings.resetDefaults') || 'Reset to Defaults'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.syncInstructions') || 'How to Sync with Repository'}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <ol className="list-decimal list-inside space-y-2">
            <li>{t('settings.step1') || 'Configure your environment variables above'}</li>
            <li>{t('settings.step2') || 'Click "Save Configuration" to persist changes'}</li>
            <li>{t('settings.step3') || 'Click "Export to spark.meta.json" to download the file'}</li>
            <li>{t('settings.step4') || 'Replace the spark.meta.json in your repository root with the downloaded file'}</li>
            <li>{t('settings.step5') || 'Commit with message: "chore(tba-waad-system): sync Spark environment variables"'}</li>
            <li>{t('settings.step6') || 'Push to your deployment branch (e.g., main)'}</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  )
}
