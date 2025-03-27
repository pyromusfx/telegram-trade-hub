
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ApiKey, Exchange, generateMockApiKeys } from "@/utils/types";
import { Plus, Trash, Edit, Key, CheckCircle, AlertTriangle, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ApiKeyManager: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(generateMockApiKeys());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<ApiKey | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    exchange: Exchange.BINANCE,
    apiKey: "",
    secretKey: "",
    isActive: true,
  });
  
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      exchange: value as Exchange,
    });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({
      ...formData,
      isActive: checked,
    });
  };

  const handleAddKey = () => {
    const newKey: ApiKey = {
      id: `key-${Date.now()}`,
      exchange: formData.exchange,
      name: formData.name,
      apiKey: formData.apiKey,
      secretKey: formData.secretKey,
      isActive: formData.isActive,
      createdAt: new Date(),
    };

    setApiKeys([...apiKeys, newKey]);
    setIsAddDialogOpen(false);
    resetForm();
    
    toast({
      title: "API Key Added",
      description: `${formData.name} has been successfully added.`,
    });
  };

  const handleEditKey = () => {
    if (!selectedKey) return;

    const updatedKeys = apiKeys.map((key) =>
      key.id === selectedKey.id
        ? {
            ...key,
            name: formData.name,
            exchange: formData.exchange,
            apiKey: formData.apiKey,
            secretKey: formData.secretKey,
            isActive: formData.isActive,
          }
        : key
    );

    setApiKeys(updatedKeys);
    setIsEditDialogOpen(false);
    resetForm();
    
    toast({
      title: "API Key Updated",
      description: `${formData.name} has been successfully updated.`,
    });
  };

  const handleDeleteKey = () => {
    if (!selectedKey) return;

    const updatedKeys = apiKeys.filter((key) => key.id !== selectedKey.id);
    setApiKeys(updatedKeys);
    setIsDeleteDialogOpen(false);
    
    toast({
      title: "API Key Deleted",
      description: `${selectedKey.name} has been removed.`,
      variant: "destructive",
    });
  };

  const openEditDialog = (key: ApiKey) => {
    setSelectedKey(key);
    setFormData({
      name: key.name,
      exchange: key.exchange,
      apiKey: key.apiKey,
      secretKey: key.secretKey,
      isActive: key.isActive,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (key: ApiKey) => {
    setSelectedKey(key);
    setIsDeleteDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      exchange: Exchange.BINANCE,
      apiKey: "",
      secretKey: "",
      isActive: true,
    });
    setSelectedKey(null);
  };

  const verifyApiKey = (key: ApiKey) => {
    toast({
      title: "Verifying API Key",
      description: "Checking connection to exchange...",
    });
    
    // Simulate verification
    setTimeout(() => {
      toast({
        title: "API Key Verified",
        description: "Connection to exchange is successful.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">API Key Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus size={16} />
              Add New Key
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New API Key</DialogTitle>
              <DialogDescription>
                Add your exchange API keys to enable automated trading.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Key Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="My Binance Account"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="exchange">Exchange</Label>
                <Select
                  value={formData.exchange}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select exchange" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Exchange.BINANCE}>Binance</SelectItem>
                    <SelectItem value={Exchange.BYBIT}>Bybit</SelectItem>
                    <SelectItem value={Exchange.BINGX}>BingX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input
                  id="apiKey"
                  name="apiKey"
                  placeholder="Enter your API key"
                  value={formData.apiKey}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="secretKey">Secret Key</Label>
                <Input
                  id="secretKey"
                  name="secretKey"
                  type="password"
                  placeholder="Enter your Secret key"
                  value={formData.secretKey}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={handleSwitchChange}
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddKey}>Add Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* API Key Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {apiKeys.map((key) => (
          <Card key={key.id} className={`border ${key.isActive ? 'border-primary/30' : 'border-border'} transition-colors`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-1.5">
                    {key.name}
                    {key.isActive && (
                      <span className="inline-block w-2 h-2 rounded-full bg-signal-success"></span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {key.exchange} • Added on{" "}
                    {key.createdAt.toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(key)}
                  >
                    <Edit size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(key)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">API Key:</span>
                  <span className="font-mono">
                    {key.apiKey.substring(0, 4)}...
                    {key.apiKey.substring(key.apiKey.length - 4)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Secret Key:</span>
                  <span className="font-mono">••••••••••••••••</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => verifyApiKey(key)}
              >
                <CheckCircle size={14} className="mr-1" />
                Verify
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Link size={14} className="mr-1" />
                Permissions
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit API Key</DialogTitle>
            <DialogDescription>
              Update your exchange API key settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Key Name</Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-exchange">Exchange</Label>
              <Select
                value={formData.exchange}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger id="edit-exchange">
                  <SelectValue placeholder="Select exchange" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Exchange.BINANCE}>Binance</SelectItem>
                  <SelectItem value={Exchange.BYBIT}>Bybit</SelectItem>
                  <SelectItem value={Exchange.BINGX}>BingX</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-apiKey">API Key</Label>
              <Input
                id="edit-apiKey"
                name="apiKey"
                value={formData.apiKey}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-secretKey">Secret Key</Label>
              <Input
                id="edit-secretKey"
                name="secretKey"
                type="password"
                value={formData.secretKey}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                checked={formData.isActive}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditKey}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this API key? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center p-4 border rounded-md bg-secondary/30 gap-3">
            <AlertTriangle className="text-signal-warning" size={20} />
            <div className="text-sm">
              <p className="font-medium">{selectedKey?.name}</p>
              <p className="text-muted-foreground">{selectedKey?.exchange}</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteKey}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApiKeyManager;
