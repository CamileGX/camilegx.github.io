const escape = value => value.replace(/[&<>]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;"})[char]);
export function renderMarkdown(value = "") { return escape(value).replace(/^### (.*)$/gm,"<h3>$1</h3>").replace(/^## (.*)$/gm,"<h2>$1</h2>").replace(/^# (.*)$/gm,"<h1>$1</h1>").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/`(.*?)`/g,"<code>$1</code>").replace(/\n/g,"<br>"); }
