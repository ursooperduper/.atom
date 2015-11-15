// Generates Atom menu file from Emmet action list
var fs = require('fs');
var path = require('path');
var actions = require('emmet/lib/action/main');

function generateMenu(menu) {
	return menu.map(function (item) {
		if (item.type == 'action') {
			return {
				label: item.label,
				command: 'emmet:' + item.name.replace(/_/g, '-')
			};
		}

		if (item.type == 'submenu') {
			return {
				label: item.name,
				submenu: generateMenu(item.items)
			};
		}
	});
}

var menu = {
	'menu': [{
		label: 'Packages',
		submenu: [{
			label: 'Emmet',
			submenu: generateMenu(actions.getMenu()).concat([{
				label: 'Interactive Expand Abbreviation',
				command: 'emmet:interactive-expand-abbreviation'
			}])
		}]
	}]
};

var menuFile = path.join(__dirname, 'menus', 'emmet.json');
fs.writeFileSync(menuFile, JSON.stringify(menu, null, '\t'), { encoding: 'utf8' });

console.log('Menu file "%s" generated successfully', menuFile);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9lbW1ldC9nZW5lcmF0ZS1tZW51LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsSUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQzNCLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDOztBQUUvQyxTQUFTLFlBQVksQ0FBQyxJQUFJLEVBQUU7QUFDM0IsUUFBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVMsSUFBSSxFQUFFO0FBQzlCLE1BQUksSUFBSSxDQUFDLElBQUksSUFBSSxRQUFRLEVBQUU7QUFDMUIsVUFBTztBQUNOLFNBQUssRUFBRSxJQUFJLENBQUMsS0FBSztBQUNqQixXQUFPLEVBQUUsUUFBUSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUM7SUFDaEQsQ0FBQztHQUNGOztBQUVELE1BQUksSUFBSSxDQUFDLElBQUksSUFBSSxTQUFTLEVBQUU7QUFDM0IsVUFBTztBQUNOLFNBQUssRUFBRSxJQUFJLENBQUMsSUFBSTtBQUNoQixXQUFPLEVBQUUsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7SUFDakMsQ0FBQztHQUNGO0VBQ0QsQ0FBQyxDQUFDO0NBQ0g7O0FBRUQsSUFBSSxJQUFJLEdBQUc7QUFDVixPQUFNLEVBQUUsQ0FBQztBQUNSLE9BQUssRUFBRSxVQUFVO0FBQ2pCLFNBQU8sRUFBRSxDQUFDO0FBQ1QsUUFBSyxFQUFFLE9BQU87QUFDZCxVQUFPLEVBQUUsWUFBWSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ2hELFNBQUssRUFBRSxpQ0FBaUM7QUFDeEMsV0FBTyxFQUFFLHVDQUF1QztJQUNoRCxDQUFDLENBQUM7R0FDSCxDQUFDO0VBQ0YsQ0FBQztDQUNGLENBQUM7O0FBRUYsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFlBQVksQ0FBQyxDQUFDO0FBQzNELEVBQUUsQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsRUFBRSxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMsQ0FBQyxDQUFDOztBQUVqRixPQUFPLENBQUMsR0FBRyxDQUFDLHVDQUF1QyxFQUFFLFFBQVEsQ0FBQyxDQUFDIiwiZmlsZSI6Ii9Vc2Vycy9zYXJhaC8uYXRvbS9wYWNrYWdlcy9lbW1ldC9nZW5lcmF0ZS1tZW51LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gR2VuZXJhdGVzIEF0b20gbWVudSBmaWxlIGZyb20gRW1tZXQgYWN0aW9uIGxpc3RcbnZhciBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG52YXIgcGF0aCA9IHJlcXVpcmUoJ3BhdGgnKTtcbnZhciBhY3Rpb25zID0gcmVxdWlyZSgnZW1tZXQvbGliL2FjdGlvbi9tYWluJyk7XG5cbmZ1bmN0aW9uIGdlbmVyYXRlTWVudShtZW51KSB7XG5cdHJldHVybiBtZW51Lm1hcChmdW5jdGlvbihpdGVtKSB7XG5cdFx0aWYgKGl0ZW0udHlwZSA9PSAnYWN0aW9uJykge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGFiZWw6IGl0ZW0ubGFiZWwsXG5cdFx0XHRcdGNvbW1hbmQ6ICdlbW1ldDonICsgaXRlbS5uYW1lLnJlcGxhY2UoL18vZywgJy0nKVxuXHRcdFx0fTtcblx0XHR9XG5cblx0XHRpZiAoaXRlbS50eXBlID09ICdzdWJtZW51Jykge1xuXHRcdFx0cmV0dXJuIHtcblx0XHRcdFx0bGFiZWw6IGl0ZW0ubmFtZSxcblx0XHRcdFx0c3VibWVudTogZ2VuZXJhdGVNZW51KGl0ZW0uaXRlbXMpXG5cdFx0XHR9O1xuXHRcdH1cblx0fSk7XG59XG5cbnZhciBtZW51ID0ge1xuXHQnbWVudSc6IFt7XG5cdFx0bGFiZWw6ICdQYWNrYWdlcycsXG5cdFx0c3VibWVudTogW3tcblx0XHRcdGxhYmVsOiAnRW1tZXQnLFxuXHRcdFx0c3VibWVudTogZ2VuZXJhdGVNZW51KGFjdGlvbnMuZ2V0TWVudSgpKS5jb25jYXQoW3tcblx0XHRcdFx0bGFiZWw6ICdJbnRlcmFjdGl2ZSBFeHBhbmQgQWJicmV2aWF0aW9uJyxcblx0XHRcdFx0Y29tbWFuZDogJ2VtbWV0OmludGVyYWN0aXZlLWV4cGFuZC1hYmJyZXZpYXRpb24nXG5cdFx0XHR9XSlcblx0XHR9XVxuXHR9XVxufTtcblxudmFyIG1lbnVGaWxlID0gcGF0aC5qb2luKF9fZGlybmFtZSwgJ21lbnVzJywgJ2VtbWV0Lmpzb24nKTtcbmZzLndyaXRlRmlsZVN5bmMobWVudUZpbGUsIEpTT04uc3RyaW5naWZ5KG1lbnUsIG51bGwsICdcXHQnKSwge2VuY29kaW5nOiAndXRmOCd9KTtcblxuY29uc29sZS5sb2coJ01lbnUgZmlsZSBcIiVzXCIgZ2VuZXJhdGVkIHN1Y2Nlc3NmdWxseScsIG1lbnVGaWxlKTsiXX0=