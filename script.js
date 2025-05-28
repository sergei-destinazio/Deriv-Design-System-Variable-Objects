import standardVars from 'https://cdn.jsdelivr.net/gh/sergei-destinazio/Deriv-Design-System-Variable-Objects@main/standard-variables-v4.js';
import academyVars from 'https://cdn.jsdelivr.net/gh/sergei-destinazio/Deriv-Design-System-Variable-Objects@main/academy-variables-v4.js';

const jsonTextarea = document.querySelector('#json-textarea');
const jsonForm = document.querySelector('#json-form');
const resultBlock = document.querySelector('#json-result');
const projectVars = {
	standard: standardVars,
  academy: academyVars
}

jsonForm.addEventListener('submit', (e) => {
	e.preventDefault();
  e.stopPropagation();
  
  const project = document.querySelector('[name="project"]:checked')?.value;
  const variables = projectVars[project];
  
  if (!variables) console.error('Invalid project value');

	let updatedJson = replaceCssValues(jsonTextarea.value, variables);
  updatedJson = replaceBgGradient(updatedJson, variables);
  resultBlock.innerText = updatedJson;
});

function replaceCssValues(input, rules) {
  for (const { property, value, variable } of rules) {
    const properties = Array.isArray(property) ? property : [property];

    for (const prop of properties) {
      // Escape special characters in the property name and value
      const escapedProperty = prop.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const escapedValue = value.replace(/[#\-\/\\^$*+?.()|[\]{}]/g, '\\$&');

      // Search for 'property: value;' with any spaces
      const regex = new RegExp(`(${escapedProperty}\\s*:\\s*)${escapedValue}(\\s*;)`, 'gi');

      // Replace the value with a variable
      input = input.replace(regex, `$1${variable}$2`);
    }
  }

  return input;
}

function replaceBgGradient(input, rules) {

  for (const { property, value, variable } of rules) {
		if (value === 'white' || value === 'black' || !property.includes('background-color')) continue;
    const escapedFind = value.replace(/[#\-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(escapedFind, 'g');
    input = input.replace(regex, variable);
  }

  return input;
}