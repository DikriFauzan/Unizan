package com.feac;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.os.Handler;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import android.widget.Toast;
import java.io.BufferedReader;
import java.io.FileReader;
import java.io.File;

public class MainActivity extends Activity {
    private WebView webView;
    private Handler handler = new Handler();
    private static final String OUTPUT_FILE = "/sdcard/Documents/Dikri/FEAC/output/last_output.txt";

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        webView = new WebView(this);
        setContentView(webView);
        webView.getSettings().setJavaScriptEnabled(true);
        webView.addJavascriptInterface(new TermuxBridge(), "Android");
        webView.loadUrl("file:///android_asset/index.html");
        // Mulai polling output
        startPollingOutput();
    }

    private void startPollingOutput() {
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                String output = readOutputFile();
                if (output != null && !output.isEmpty()) {
                    webView.evaluateJavascript("javascript:displayOutput(`" + 
                        output.replace("`", "\\`").replace("\\", "\\\\") + "`)", null);
                }
                handler.postDelayed(this, 2000); // Cek setiap 2 detik
            }
        }, 2000);
    }

    private String readOutputFile() {
        try {
            File file = new File(OUTPUT_FILE);
            if (!file.exists()) return null;

            BufferedReader reader = new BufferedReader(new FileReader(file));
            StringBuilder output = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                output.append(line).append("\n");
            }
            reader.close();
            return output.toString();
        } catch (Exception e) {
            return "ERROR: " + e.getMessage();
        }
    }

    public class TermuxBridge {
        @JavascriptInterface
        public void runTermuxCommand(String command) {
            try {
                Intent intent = new Intent();
                intent.setClassName("com.termux", "com.termux.app.RunCommandService");
                intent.setAction("com.termux.RUN_COMMAND");
                String fullCommand = "python3 /data/data/com.termux/files/home/dikri/feac_bridge.py " + command;
                intent.putExtra("com.termux.RUN_COMMAND_PATH", fullCommand);
                intent.putExtra("com.termux.RUN_COMMAND_WORKDIR", "/data/data/com.termux/files/home");
                intent.putExtra("com.termux.RUN_COMMAND_BACKGROUND", true);
                startService(intent);
                Toast.makeText(MainActivity.this, "Perintah dikirim: " + command, Toast.LENGTH_SHORT).show();
            } catch (Exception e) {
                Toast.makeText(MainActivity.this, "Gagal: " + e.getMessage(), Toast.LENGTH_LONG).show();
            }
        }
    }
}
