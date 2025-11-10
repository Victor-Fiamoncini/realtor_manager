import { Loader2 } from 'lucide-react'
import React from 'react'

const AppLoading = () => (
  <div className="bg-background/50 fixed inset-0 flex items-center justify-center gap-2">
    <Loader2 className="text-primary h-6 w-6 animate-spin" />

    <span className="text-primary text-sm font-medium">Loading...</span>
  </div>
)

export default AppLoading
