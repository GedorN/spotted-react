package com.triade.spotted;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        Intent intent = new Intent(this, MainActivity.class);

        // NOTE: This is necessary to forward the original intent on to the main activity.
        // This makes firebase.notifications().getInitialNotification() work.
        intent.putExtras(this.getIntent());
        startActivity(intent);
        finish();
    }
}
