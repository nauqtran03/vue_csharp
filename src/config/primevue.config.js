export const primeVueConfig = {
  theme: {
    preset: null, // Sẽ import Aura ở main.js
    options: {
      darkModeSelector: false,
      cssLayer: false
    }
  },
  pt: {
    select: {
      overlay: {
        style: {
          background: '#ffffff',
          border: '1px solid #afafaf',
          borderRadius: '2.5px',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
        }
      },
      filterContainer: {
        style: {
          padding: '8px',
          background: '#ffffff'
        }
      },
      filter: {
        style: {
          width: '100%',
          padding: '8px 12px',
          border: '1px solid #afafaf',
          borderRadius: '2.5px',
          fontSize: '13px',
          background: '#ffffff',
          color: '#000000'
        }
      },
      list: {
        style: {
          padding: '4px 0',
          background: '#ffffff'
        }
      },
      option: {
        style: {
          fontSize: '13px',
          padding: '8px 12px',
          color: '#000000',
          background: '#ffffff'
        }
      }
    }
  }
}