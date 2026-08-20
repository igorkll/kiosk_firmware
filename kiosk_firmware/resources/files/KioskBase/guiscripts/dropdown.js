(function() {

// -------------------------------------- dropdown (без storage)

window.createDropdownSimple = function(options, defaultIndex = -1, onChangeCallback = null) {
    // options: массив строк или объектов { label, value }
    const normalizedOptions = options.map(opt =>
        typeof opt === 'string' ? { label: opt, value: opt } : opt
    );

    const select = document.createElement('select');

    // Placeholder – невыбираемый элемент
    const placeholder = document.createElement('option');
    placeholder.value = '';
    placeholder.textContent = '— Select —';
    placeholder.disabled = true;
    placeholder.selected = (defaultIndex < 0 || defaultIndex >= normalizedOptions.length);
    select.appendChild(placeholder);

    // Основные опции
    normalizedOptions.forEach((opt, idx) => {
        const option = document.createElement('option');
        option.value = opt.value;
        option.textContent = opt.label;
        if (idx === defaultIndex && defaultIndex >= 0 && defaultIndex < normalizedOptions.length) {
            option.selected = true;
        }
        select.appendChild(option);
    })

    select.addEventListener('change', () => {
        const selectedIndex = select.selectedIndex - 1; // потому что первый — placeholder
        if (selectedIndex >= 0 && selectedIndex < normalizedOptions.length) {
            const selectedValue = normalizedOptions[selectedIndex].value;
            if (onChangeCallback) onChangeCallback(selectedValue, selectedIndex);
        } else {
            // Если выбран placeholder – передаём null или -1
            if (onChangeCallback) onChangeCallback(null, -1);
        }
    })

    return select
}

})();