import type { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  schema: './app/graphql/schema.graphql',
  documents: ['app/**/*.tsx', 'app/**/*.ts'],
  ignoreNoDocuments: true,
  generates: {
    './app/graphql/': {
      preset: 'client',
      config: {
        documentMode: 'string'
      }
    }
  }
}

export default config