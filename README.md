# Kiosk firmware
![preview](https://raw.githubusercontent.com/igorkll/kiosk_firmware/refs/heads/main/screenshots/1.png)  
free open source OS for kiosks  
used build system: https://github.com/igorkll/Gnubox-Maker  

## setup
there are several ways to get into the setup window:  
* Press the physical power button on the device
* keyboard shortcut ctrl+alt+delete
* hold it down for 5 seconds: ctrl+super+shift+s

## download last release build
* x86_64 BIOS / UEFI: 

## roadmap
* Raspberry Pi x64 support (this is currently working, but without GPU acceleration due to a bug in Weston)
* the menu for connecting to wifi. to avoid the need to use nmcli in the terminal
* selecting audio output and audio input in the GUI
* the ability to activate full access to the kiosk system (including root rights) for the site with a single check mark. This will be a big security hole, but it will allow you to, for example, connect to payment terminals
* the ability to save/load configuration from a USB flash drive
* the ability to update the system from a USB flash drive without reinstalling, through the built-in update mechanism in gnubox maker (self_update)
