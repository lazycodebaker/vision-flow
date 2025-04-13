
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Settings, Save } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSaveSettings: (settings: SettingsType) => void;
  settings: SettingsType;
}

export interface SettingsType {
  processingQuality: number;
  autoSaveResults: boolean;
  showNodeLabels: boolean;
  enableAnimations: boolean;
  webcamEnabled: boolean;
  webcamResolution: string;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  open,
  onOpenChange,
  onSaveSettings,
  settings: initialSettings,
}) => {
  const [settings, setSettings] = React.useState<SettingsType>(initialSettings);
  const { isDark } = useTheme();

  const handleSave = () => {
    onSaveSettings(settings);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`sm:max-w-md ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" /> Settings
          </DialogTitle>
          <DialogDescription>
            Configure your VisionFlow application preferences
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Processing Options</h3>
            <Separator />

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="processingQuality">Processing Quality</Label>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {settings.processingQuality === 1 ? 'Low' :
                      settings.processingQuality === 2 ? 'Medium' : 'High'}
                  </span>
                </div>
                <Slider
                  id="processingQuality"
                  min={1}
                  max={3}
                  step={1}
                  value={[settings.processingQuality]}
                  onValueChange={(value) => setSettings({ ...settings, processingQuality: value[0] })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="autoSaveResults">Auto-save results</Label>
                <Switch
                  id="autoSaveResults"
                  checked={settings.autoSaveResults}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoSaveResults: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="showNodeLabels">Show node labels</Label>
                <Switch
                  id="showNodeLabels"
                  checked={settings.showNodeLabels}
                  onCheckedChange={(checked) => setSettings({ ...settings, showNodeLabels: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="enableAnimations">Enable animations</Label>
                <Switch
                  id="enableAnimations"
                  checked={settings.enableAnimations}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableAnimations: checked })}
                />
              </div>
            </div>
          </div>

          {/* <div className="space-y-2">
            <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Webcam Streaming</h3>
            <Separator />

            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="webcamEnabled">Enable webcam streaming</Label>
                <Switch
                  id="webcamEnabled"
                  checked={settings.webcamEnabled}
                  onCheckedChange={(checked) => setSettings({ ...settings, webcamEnabled: checked })}
                />
              </div>

              {settings.webcamEnabled && (
                <div className="space-y-2">
                  <Label htmlFor="webcamResolution">Webcam Resolution</Label>
                  <select
                    id="webcamResolution"
                    value={settings.webcamResolution}
                    onChange={(e) => setSettings({ ...settings, webcamResolution: e.target.value })}
                    className={`w-full rounded-md border ${isDark
                        ? 'bg-gray-800 border-gray-700 text-gray-200'
                        : 'bg-white border-gray-300 text-gray-800'
                      } p-2 text-sm`}
                  >
                    <option value="640x480">Low (640x480)</option>
                    <option value="1280x720">Medium (1280x720)</option>
                    <option value="1920x1080">High (1920x1080)</option>
                  </select>
                </div>
              )}
            </div>
          </div> */}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave} className="flex items-center gap-1">
            <Save className="h-4 w-4" /> Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;
