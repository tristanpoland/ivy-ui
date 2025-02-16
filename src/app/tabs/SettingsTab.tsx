import React from 'react';
import { Shield, Bell, User, HardDrive } from 'lucide-react';

export function SettingsTab() {
  const sections = [
    {
      icon: Shield,
      title: 'Security',
      description: 'Configure security settings and encryption preferences',
      settings: [
        { name: 'Two-factor authentication', enabled: true },
        { name: 'End-to-end encryption', enabled: true },
        { name: 'Biometric unlock', enabled: false }
      ]
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Manage your notification preferences',
      settings: [
        { name: 'Backup alerts', enabled: true },
        { name: 'Share notifications', enabled: true },
        { name: 'Storage warnings', enabled: true }
      ]
    },
    {
      icon: HardDrive,
      title: 'Storage',
      description: 'Manage storage settings and quotas',
      settings: [
        { name: 'Auto-cleanup', enabled: false },
        { name: 'Compression', enabled: true },
        { name: 'Version history', enabled: true }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">Settings</h2>
      
      <div className="grid gap-6">
        {sections.map((section) => (
          <div key={section.title} className="bg-neutral-800/40 rounded-lg border border-neutral-700/50 p-4">
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-lg bg-neutral-700/30">
                <section.icon className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-medium">{section.title}</h3>
                <p className="text-sm text-neutral-400 mt-1">{section.description}</p>
                
                <div className="mt-4 space-y-3">
                  {section.settings.map((setting) => (
                    <div key={setting.name} className="flex items-center justify-between">
                      <span className="text-sm text-neutral-300">{setting.name}</span>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          setting.enabled ? 'bg-emerald-500' : 'bg-neutral-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            setting.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}