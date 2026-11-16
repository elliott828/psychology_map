param([string]$Voice,[string]$TextFile,[string]$Out,[double]$Rate=1.0)
Add-Type -AssemblyName System.Runtime.WindowsRuntime
[void][Windows.Media.SpeechSynthesis.SpeechSynthesizer,Windows.Media.SpeechSynthesis,ContentType=WindowsRuntime]
$asTaskG = ([System.WindowsRuntimeSystemExtensions].GetMethods() | ? { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($op,$t){ $m=$asTaskG.MakeGenericMethod($t); $task=$m.Invoke($null,@($op)); $task.Wait(-1)|Out-Null; $task.Result }
$s = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$v = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | ? { $_.DisplayName -like "*$Voice*" } | select -First 1
if(-not $v){ Write-Error "no voice $Voice"; exit 1 }
$s.Voice=$v
$s.Options.SpeakingRate=$Rate
$text=[IO.File]::ReadAllText($TextFile,[Text.Encoding]::UTF8)
$st = Await ($s.SynthesizeTextToStreamAsync($text)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
$str=[System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($st)
$fs=[IO.File]::Create($Out); $str.CopyTo($fs); $fs.Close()
