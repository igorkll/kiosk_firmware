# Kiosk firmware
![preview](https://raw.githubusercontent.com/igorkll/kiosk_firmware/refs/heads/main/screenshots/1.1.png)  
![preview](https://raw.githubusercontent.com/igorkll/kiosk_firmware/refs/heads/main/screenshots/2.png)  
free open source OS for kiosks  
used build system: https://github.com/igorkll/Gnubox-Maker  
page for test website root access: https://igorkll.github.io/test/kiosk_firmware_website_root  

## features
* the ability to set a session timeout
* the ability to give the site root access for full integration with hardware

## setup
there are several ways to get into the setup window:  
* Press the physical power button on the device
* keyboard shortcut ctrl+alt+delete
* hold it down for 5 seconds: ctrl+super+shift+s

## download last release build
* x86_64 BIOS / UEFI: https://drive.google.com/file/d/1FLsYqHHgXv5M_ynwdy--WVJ0BhO81hqy/view?usp=sharing

## roadmap
* Raspberry Pi x64 support (this is currently working, but without GPU acceleration due to a bug in Weston)
* the menu for connecting to wifi. to avoid the need to use nmcli in the terminal
* selecting audio output and audio input in the GUI
* the ability to save/load configuration from a USB flash drive
* the ability to update the system from a USB flash drive without reinstalling, through the built-in update mechanism in gnubox maker (self_update)
* enabling/hiding the internet connection waiting display
* enabling/hiding waiting for a website to load
* menu for setting the RTC clock, enabling and disabling NTP, and setting the time zone
* the ability to set an administrator password to access the settings menu
* a menu with display settings and the ability to flip the display
### completed
* make the settings menu close automatically after 10 seconds of inactivity when the menu is open
* the ability to activate full access to the kiosk system (including root rights) for the site with a single check mark. This will be a big security hole, but it will allow you to, for example, connect to payment terminals
