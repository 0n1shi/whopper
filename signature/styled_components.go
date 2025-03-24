package signature

var StyledComponentsSignature = Signature{
	Name:        "styled components",
	Description: "styled-components is the result of wondering how we could enhance CSS for styling React component systems.",
	Cpe:         "",

	DetectPattern: DetectPattern{
		URLs: []string{
			"styled-components",
		},
		Bodies: []string{
			"data-styled=\"true\"",
			"data-styled-version",
		},
	},
	VersionPattern: VersionPattern{
		Bodies: []string{
			`data-styled-version="(\d+\.\d+\.\d+)"`,
			`t\["data-styled-version"\]="(\d+\.\d+\.\d+)"`,
			`\[data-styled-version="(\d+\.\d+\.\d+)"\]`,
			`setAttribute\("data-styled-version","(\d+\.\d+\.\d+)"\)`,
			`<style data-styled="true" data-styled-version="(\d+\.\d+\.\d+)">`,
		},
	},
}
