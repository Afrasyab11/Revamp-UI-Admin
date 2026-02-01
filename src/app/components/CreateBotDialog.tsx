import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';

interface CreateBotDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateBot: (name: string, description: string) => void;
}

export default function CreateBotDialog({ open, onOpenChange, onCreateBot }: CreateBotDialogProps) {
  const [botName, setBotName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ name: '', description: '' });

  const handleCreate = () => {
    // Validate
    const newErrors = { name: '', description: '' };
    
    if (!botName.trim()) {
      newErrors.name = 'Bot name is required';
    }
    
    if (description.length > 300) {
      newErrors.description = 'Description must be 300 characters or less';
    }
    
    if (newErrors.name || newErrors.description) {
      setErrors(newErrors);
      return;
    }
    
    // Create bot
    onCreateBot(botName, description);
    
    // Reset form
    setBotName('');
    setDescription('');
    setErrors({ name: '', description: '' });
    onOpenChange(false);
  };

  const handleClose = () => {
    setBotName('');
    setDescription('');
    setErrors({ name: '', description: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Bot</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label htmlFor="botName">
              User Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="botName"
              placeholder="Bot Name"
              value={botName}
              onChange={(e) => {
                setBotName(e.target.value);
                setErrors({ ...errors, name: '' });
              }}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter your bot description"
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setErrors({ ...errors, description: '' });
              }}
              rows={4}
              className={`resize-none ${errors.description ? 'border-red-500' : ''}`}
            />
            <div className="flex items-center justify-between">
              <p className={`text-xs ${description.length > 300 ? 'text-red-500' : 'text-gray-500'}`}>
                300 characters maximum
              </p>
              <p className={`text-xs ${description.length > 300 ? 'text-red-500' : 'text-gray-500'}`}>
                {description.length}/300
              </p>
            </div>
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700">
            Create
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
