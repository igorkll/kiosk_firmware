#!/bin/bash
set -e

mkdir -p /etc/acpi/events
cat > "/etc/acpi/events/powerbtn-custom" <<EOF
event=button[ /]power
action=/KioskBase/open_kiosk_setup.sh
EOF
chmod 644 /etc/acpi/events/powerbtn-custom

touch /.kiosk_firmware

touch /.chrootend