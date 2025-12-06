<template>
  <n-tabs class="all-box" size="large" justify-content="space-evenly" animated>
    <n-tab-pane class="no-padding height--full" name="link" tab="Shortcuts">
      <ShortCut />
    </n-tab-pane>
    <n-tab-pane name="guide" tab="Guide">
      <n-scrollbar class="scrollbar">
        <div style="padding: 0 20px;">
          <h2 style="margin-top: 0;">🎉 Welcome to SuisoruIX!</h2>
          <p style="opacity: 0.8; margin-bottom: 30px;">Your beautiful Material You start page with powerful search capabilities.</p>
          
          <h3>🔍 Search</h3>
          <p><strong>Quick Search:</strong> Click the search box or press <code>Enter</code> to start searching.</p>
          <p><strong>Switch Engines:</strong> Click the icon on the left side of the search box to switch between search engines (Google, Bing, Baidu, etc.).</p>
          <p><strong>Smart Detection:</strong> The search box automatically detects URLs and email addresses.</p>
          <p style="margin-bottom: 30px;"><strong>Search Suggestions:</strong> Enable real-time search suggestions in Settings.</p>
          
          <h3>🔖 Shortcuts</h3>
          <p><strong>Access Shortcuts:</strong> Click the time display or right-click anywhere on the page to open the shortcuts panel.</p>
          <p><strong>Expand Panel:</strong> Click the expand button in the top-left corner to maximize the shortcuts view.</p>
          <p><strong>Add Shortcuts:</strong> Click the "+" button to add your frequently visited websites.</p>
          <p style="margin-bottom: 30px;"><strong>Edit Shortcuts:</strong> Long press (mobile) or right-click (desktop) on any shortcut to edit or delete it.</p>
          
          <h3>⚙️ Settings</h3>
          <p><strong>Access Settings:</strong> Click the time display, then click the settings button in the top-right corner.</p>
          <p><strong>Themes:</strong> Switch between light and dark modes.</p>
          <p><strong>Wallpapers:</strong> Choose from Daily Bing, random scenery, anime images, or upload your own.</p>
          <p><strong>Time & Weather:</strong> Customize clock style, format, and weather display.</p>
          <p style="margin-bottom: 30px;"><strong>Backup:</strong> Export your settings and shortcuts for safekeeping.</p>
          
          <h3>⌨️ Keyboard Shortcuts</h3>
          <p><code>Enter</code> - Focus search box</p>
          <p><code>Esc</code> - Close panels and return to home</p>
          <p style="margin-bottom: 30px;"><code>Right Click</code> - Open shortcuts panel</p>
          
          <h3>💡 Tips</h3>
          <p>• The search box automatically collapses when not in use (configurable in Settings).</p>
          <p>• Weather data updates every 5 minutes automatically.</p>
          <p>• All your settings are saved locally in your browser.</p>
          <p>• You can install this page as a PWA (Progressive Web App) for offline access.</p>
        </div>
      </n-scrollbar>
    </n-tab-pane>
    <n-tab-pane name="suisoruix" tab="About">
      <n-scrollbar class="scrollbar">
        <div style="padding: 0 20px;">
          <h2 style="margin-top: 0;">✨ SuisoruIX</h2>
          <p style="opacity: 0.8; margin-bottom: 20px;">A beautiful Material You start page developed by the Open Source Community.</p>
          
          <h3>🎨 Design</h3>
          <p>Built with Material Design 3 (Material You) guidelines, featuring:</p>
          <ul style="opacity: 0.8;">
            <li>Dynamic purple color palette</li>
            <li>Smooth animations and transitions</li>
            <li>Glassmorphism effects</li>
            <li>Responsive design for all devices</li>
          </ul>
          
          <h3>🛠️ Technology</h3>
          <p style="opacity: 0.8;">Powered by Vue 3, Vite, and modern web technologies.</p>
          
          <h3>📝 Version</h3>
          <p style="opacity: 0.8;">v2.0.0 beta 5</p>
          
          <h3>🙏 Credits</h3>
          <p style="opacity: 0.8;">Based on <a href="https://github.com/imsyy/SNav" target="_blank" style="color: var(--md-sys-color-primary);">SNav</a></p>
          <p style="opacity: 0.8;">Developed by <a href="https://rincynar.top" target="_blank" style="color: var(--md-sys-color-primary);">RinCynar</a></p>
          
          <p style="margin-top: 30px; opacity: 0.6; font-size: 0.9em;">© 2024 SuisoruIX. All rights reserved.</p>
        </div>
      </n-scrollbar>
    </n-tab-pane>
  </n-tabs>
</template>

<script setup>
import { NTabs, NTabPane } from "naive-ui";
import ShortCut from "@/components/AllFunc/Box/ShortCut.vue";
</script>
<style>
.height--full {
  height: 100%;
}
</style>