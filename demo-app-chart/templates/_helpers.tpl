{{- define "demo-app-chart.name" -}}
{{ .Chart.Name }}
{{- end -}}

{{- define "demo-app-chart.fullname" -}}
{{ printf "%s-%s" .Release.Name .Chart.Name }}
{{- end -}}
