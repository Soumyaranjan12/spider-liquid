export type ComponentInfo = {
  id: string
  name: string
  category: string
  description: string
  status: string
  code: string
}

export const components: ComponentInfo[] = [
  { id: 'button', name: 'Liquid Button', category: 'Controls', description: 'A tactile, luminous button with a soft specular edge.', status: 'Ready', code: `<GlassButton variant="primary" onClick={() => console.log(1)}>Get started</GlassButton>` },
  { id: 'icon-button', name: 'Icon Button', category: 'Controls', description: 'Compact actions for toolbars and floating controls.', status: 'Ready', code: `<GlassIconButton label="Open settings">Settings</GlassIconButton>` },
  { id: 'toggle', name: 'Liquid Toggle', category: 'Controls', description: 'A clear on/off state with a springy thumb.', status: 'Ready', code: `<GlassToggle checked={true} onChange={(checked) => console.log(checked)} label="Enable glass" />` },
  { id: 'slider', name: 'Glass Slider', category: 'Controls', description: 'A customizable range control for live values.', status: 'Ready', code: `<GlassSlider label="Intensity" min={0} max={100} value={55} onChange={(value) => console.log(value)} />` },
  { id: 'segmented', name: 'Segmented Control', category: 'Controls', description: 'A compact selector with a floating active pill.', status: 'Ready', code: `<SegmentedControl options={['Light', 'Dark', 'System']} value="Dark" onChange={(mode) => console.log(mode)} />` },
  { id: 'input', name: 'Glass Input', category: 'Forms', description: 'A calm, focused field for forms and settings.', status: 'Ready', code: `<GlassInput label="Display name" placeholder="Your name" onChange={(event) => console.log(event.target.value)} />` },
  { id: 'search', name: 'Search Field', category: 'Forms', description: 'Search input with a built-in leading icon.', status: 'Ready', code: `<GlassSearch placeholder="Search components…" value="" onChange={(query) => console.log(query)} />` },
  { id: 'card', name: 'Glass Card', category: 'Surfaces', description: 'Layered translucent surfaces with fine highlights.', status: 'Ready', code: `<GlassCard><h3>Glass surface</h3><p>Content lives here.</p></GlassCard>` },
  { id: 'badge', name: 'Status Badge', category: 'Surfaces', description: 'A compact status capsule for metadata.', status: 'Ready', code: `<GlassBadge tone="success">Operational</GlassBadge>` },
  { id: 'progress', name: 'Progress Bar', category: 'Feedback', description: 'A glowing progress indicator for tasks.', status: 'Ready', code: `<GlassProgress value={72} label="Uploading" />` },
  { id: 'toast', name: 'Toast Notice', category: 'Feedback', description: 'A small notification surface for quick feedback.', status: 'Ready', code: `<GlassToast title="Saved successfully" description="Your changes are live." />` },
  { id: 'avatar', name: 'Avatar Stack', category: 'Surfaces', description: 'Polished avatars for collaborators and teams.', status: 'Ready', code: `<GlassAvatar initials="SP" label="SpiderPanda" />` },
  { id: 'nav', name: 'Floating Navigation', category: 'Navigation', description: 'A glass dock for switching between key views.', status: 'Ready', code: `<GlassNav items={['Home', 'Explore', 'Saved']} active="Home" onChange={(page) => console.log(page)} />` },
  { id: 'dialog', name: 'Dialog Surface', category: 'Overlays', description: 'A modal-style panel with clear hierarchy.', status: 'Ready', code: `<GlassDialog title="Ready to launch?" description="Your next idea deserves a beautiful surface." />` }
]
